FROM python:3-alpine
WORKDIR /app

COPY other/requirements.txt app.py
RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
