# Setup Guide

## Client 

- `cd ai-bot`
- `nano .env`  (Add `REACT_APP_BASE_URL=http://127.0.0.1:8000`)
- `npm install` (node version => v22.12.0,  npm version => 11.1.0)
- `npm start`



## Server

- `cd backend`
- `python3 -m venv venv` (Create python virtual environment)
- `source venv/bin/activate` (Activate virtual environment)
- `pip install -r requirements.txt`
- `uvicorn main:app --port 8000`