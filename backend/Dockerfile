FROM python:3.12-slim-bookworm

WORKDIR /app

COPY . .
RUN pip install -r requirements.txt

EXPOSE 8001
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]