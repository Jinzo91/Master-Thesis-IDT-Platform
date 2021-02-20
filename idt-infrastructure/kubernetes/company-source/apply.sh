# minikube stop && minikube delete && minikube start --cpus 4 --memory 4096 && minikube dashboard

cd 00-common
bash ./idt-common.sh
cd ..

echo ""

cd 01-idtdb
bash ./idt-db.sh
cd ..

echo ""

cd 03-idtapi
bash ./idt-api.sh
cd ..

echo ""

cd 05-ingress
bash ./idt-ingress.sh
cd ..
