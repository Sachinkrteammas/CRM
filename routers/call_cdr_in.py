from fastapi import APIRouter, Query, HTTPException, Depends
from sqlalchemy import text, create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Optional
from datetime import date

router = APIRouter()

# First DB connection
DATABASE_URL = "mysql+pymysql://root:dial%40mas123@192.168.10.12/db_dialdesk?charset=utf8mb4"
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Second DB connection
DATABASE_URL1 = "mysql+pymysql://root:vicidialnow@192.168.10.5/asterisk?charset=utf8mb4"
engine1 = create_engine(DATABASE_URL1, echo=True)
SessionLocal1 = sessionmaker(autocommit=False, autoflush=False, bind=engine1)

def get_db1():
    db = SessionLocal1()
    try:
        yield db
    finally:
        db.close()

@router.get("/call_cdr_in/")
def get_call_cdr_in(
    from_date: date,
    to_date: date,
    client_id: str = Query(..., alias="clientId"),
    category_qry: Optional[str] = "",
    db1: Session = Depends(get_db1),
    db2: Session = Depends(get_db)
):
    try:
        if client_id == "All":
            db2.execute(text("SET SESSION group_concat_max_len = 20000"))
            result = db2.execute(
                text(f"""
                    SELECT GROUP_CONCAT(campaignid) AS campaign_id 
                    FROM registration_master 
                    WHERE status = 'A' AND is_dd_client = '1' {category_qry}
                """)
            ).fetchone()

            campaign_ids = result.campaign_id
            if not campaign_ids:
                raise HTTPException(status_code=404, detail="No campaigns found for All clients")
            campaign_filter = f"t2.campaign_id IN ({campaign_ids})"
        else:
            result = db2.execute(
                text(f"""
                    SELECT campaignid 
                    FROM registration_master 
                    WHERE company_id = :client_id {category_qry}
                """),
                {"client_id": client_id}
            ).fetchone()

            if not result:
                raise HTTPException(status_code=404, detail="Client not found")
            campaign_ids = result.campaignid
            campaign_filter = f"t2.campaign_id IN ({campaign_ids})"

        query = f"""
            SELECT t2.uniqueid, SEC_TO_TIME(t6.p) AS ParkedTime, t2.campaign_id, 
                IF(queue_seconds <= 20, 1, 0) AS Call20,
                IF(queue_seconds <= 60, 1, 0) AS Call60,
                IF(queue_seconds <= 90, 1, 0) AS Call90,
                t2.user AS Agent, vc.full_name, t2.lead_id AS LeadId,
                RIGHT(phone_number, 10) AS PhoneNumber,
                DATE(call_date) AS CallDate, SEC_TO_TIME(queue_seconds) AS QueueTime,
                IF(queue_seconds = 0, FROM_UNIXTIME(t2.start_epoch), FROM_UNIXTIME(t2.start_epoch - queue_seconds)) AS QueueStart,
                FROM_UNIXTIME(t2.start_epoch) AS StartTime,
                FROM_UNIXTIME(t2.end_epoch) AS EndTime,
                SEC_TO_TIME(IFNULL(t3.talk_sec, t2.length_in_sec)) AS CallDuration,
                IFNULL(t3.talk_sec, t2.length_in_sec) AS CallDuration1,
                FROM_UNIXTIME(
                    t2.end_epoch + TIME_TO_SEC(
                        IF(t3.dispo_sec IS NULL, SEC_TO_TIME(0),
                        IF(t3.sub_status IN ('LOGIN', 'Feed') OR t3.talk_sec = t3.dispo_sec OR t3.talk_sec = 0,
                        SEC_TO_TIME(1),
                        IF(t3.dispo_sec > 100, SEC_TO_TIME(t3.dispo_sec - (t3.dispo_sec / 100) * 100),
                        SEC_TO_TIME(t3.dispo_sec)))))
                ) AS WrapEndTime,
                IF(t3.dispo_sec IS NULL, SEC_TO_TIME(0),
                IF(t3.sub_status IN ('LOGIN', 'Feed') OR t3.talk_sec = t3.dispo_sec OR t3.talk_sec = 0,
                SEC_TO_TIME(1),
                IF(t3.dispo_sec > 100, SEC_TO_TIME(t3.dispo_sec - (t3.dispo_sec / 100) * 100),
                SEC_TO_TIME(t3.dispo_sec)))) AS WrapTime,
                sub_status, t2.status, t2.term_reason, t2.xfercallid
            FROM vicidial_closer_log t2
            LEFT JOIN vicidial_agent_log t3 ON t2.uniqueid = t3.uniqueid AND t2.user = t3.user
            LEFT JOIN (
                SELECT uniqueid, SUM(parked_sec) AS p 
                FROM park_log 
                WHERE STATUS = 'GRABBED' AND DATE(parked_time) BETWEEN :from_date AND :to_date 
                GROUP BY uniqueid
            ) t6 ON t2.uniqueid = t6.uniqueid
            LEFT JOIN vicidial_users vc ON t2.user = vc.user
            WHERE DATE(t2.call_date) BETWEEN :from_date AND :to_date 
            AND {campaign_filter} 
            AND t2.lead_id IS NOT NULL
        """

        results = db1.execute(text(query), {"from_date": from_date, "to_date": to_date}).fetchall()
        data = [dict(row._mapping) for row in results]

        return {"status": "success", "data": data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
