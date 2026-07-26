import joblib
from fastapi import FastAPI
from pydantic import BaseModel,Field
import pandas as pd
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware


model=joblib.load("Mental_Health_Model.pkl")
app=FastAPI()
top_countries=['Other','India','USA','Canada','UK','Australia','Germany','France','Turkey','Mexico']

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)


class StudentData(BaseModel):
    age                     : int =Field(...,ge=10, le=100)
    gender                  : Literal['Male','Female']
    country                 : str
    academic_Level          : Literal['Undergraduate', 'Graduate', 'High School']
    most_Used_Platform      : Literal['Facebook', 'LinkedIn', 'Instagram', 'Snapchat', 'Twitter', 'YouTube', 'TikTok', 'LINE', 'KakaoTalk', 'VKontakte', 'WhatsApp', 'WeChat']
    purpose_Of_Use          : Literal['Networking', 'Education', 'Entertainment', 'News']
    avg_Daily_Usage_Hours   : float=Field(...,ge=0,le=24)
    daily_Unlocks           : int=Field(...,ge=0)
    study_Hours             : float=Field(...,le=24,ge=0)
    physical_Activity_Hours : float=Field(...,ge=0,le=24)
    sleep_Hours_Per_Night   : float=Field(...,ge=0,le=24)
    stress_Level            : Literal['Medium', 'Low', 'Very High', 'High']


class PredictionResponse(BaseModel):
    prediction_mental_score : float





@app.get("/")
def greet():
    return {"Hello"}


@app.post("/predict",response_model=PredictionResponse)
def predict(data:StudentData):

    country_grp=data.country if data.country in top_countries else "Other"

    input_row=pd.DataFrame([{
        'Age'                       :data.age,
        'Gender'                    :data.gender,
        'Country'                   :data.country,
        'Academic_Level'            :data.academic_Level,
        'Most_Used_Platform'        :data.most_Used_Platform,
        'Purpose_Of_Use'            :data.purpose_Of_Use,
        'Avg_Daily_Usage_Hours'     :data.avg_Daily_Usage_Hours,
        'Daily_Unlocks'             :data.daily_Unlocks,
        'Study_Hours'               :data.study_Hours,
        'Physical_Activity_Hours'   :data.physical_Activity_Hours,
        'Sleep_Hours_Per_Night'     :data.sleep_Hours_Per_Night,
        'Stress_Level'              :data.stress_Level,
        'Grouped_Country'           :country_grp
    }])



    prediction=model.predict(input_row)[0]

    return PredictionResponse(prediction_mental_score=round(float(prediction),2))