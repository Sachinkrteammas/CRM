from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Boolean, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

# Database setup code

DATABASE_URL = "mysql+pymysql://root:dial%40mas123@172.12.10.22/db_dialdesk?charset=utf8mb4"
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class TblUser(Base):
    __tablename__ = 'tbl_user'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    password = Column(String)
    password2 = Column(String)
    name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    user_type = Column(String, nullable=True)
    user_right = Column(String, nullable=True)
    user_active = Column(Boolean, default=True)
    update_user = Column(String, nullable=True)
    update_date = Column(DateTime, default=datetime.datetime.utcnow)
    access = Column(String, nullable=True)
    parent_access = Column(String, nullable=True)
    create_id = Column(Integer, nullable=True)
    create_at = Column(DateTime, default=datetime.datetime.utcnow)

# Create the table in the database
Base.metadata.create_all(bind=engine)

# FastAPI app setup
app = FastAPI()



##################################### signup ##############################
class UserCreate(BaseModel):
    username: str
    password: str
    password2: str
    name: str = None
    email: str = None
    phone: str = None
    designation: str = None
    user_type: str = None
    user_right: str = None
    user_active: bool = True
    access: str = None
    parent_access: str = None
    create_id: int = None

@app.post("/create_user/")
def create_user(user: UserCreate):
    # Check if passwords match
    if user.password != user.password2:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Create a new user instance
    db_user = TblUser(
        username=user.username,
        password=user.password,
        password2=user.password2,
        name=user.name,
        email=user.email,
        phone=user.phone,
        designation=user.designation,
        user_type=user.user_type,
        user_right=user.user_right,
        user_active=user.user_active,
        access=user.access,
        parent_access=user.parent_access,
        create_id=user.create_id,
        create_at=datetime.datetime.utcnow()
    )

    db = SessionLocal()
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db.close()

    return {"message": "User created successfully", "user": db_user}

################################################### End #########################


#######################################  Login ##################################

class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/login/")
def login(user: LoginRequest):
    db = SessionLocal()
    db_user = db.query(TblUser).filter(TblUser.email == user.email).first()
    db.close()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if db_user.password != user.password:
        raise HTTPException(status_code=401, detail="Incorrect password")

    return {
        "message": "Login successful",
        "user_id": db_user.id,
        "email": db_user.email
    }

################################## End ########################################
@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI User Management System"}
