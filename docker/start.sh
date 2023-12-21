sudo docker stop Backend
sudo docker stop DB
sudo docker stop Frontend
sudo docker stop FaceDetection

mkdir "data"
sudo chmod 777 data
mkdir "certs"
sudo chmod 777 certs

nohup sudo docker compose up &
