echo "Applying idt-api..."

echo "Applying Deployment idt-api..."
kubectl apply -f ./idtapi.deployment.yml

echo "Applying Service idt-api..."
kubectl apply -f ./idtapi.service.yml

echo "Resources for idt-api applied successfully."