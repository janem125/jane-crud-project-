FROM python:3-alpine
WORKDIR /app

RUN apk add --no-cache mariadb-dev gcc musl-dev

COPY requirements.txt .
RUN pip install -r ./requirements.txt


COPY . .

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
