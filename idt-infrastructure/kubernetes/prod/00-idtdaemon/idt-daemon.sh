echo "Applying idt-daemon..."

echo "Applying Deployment idt-daemon..."
kubectl apply -f ./idtdaemon.deployment.yml

echo "Applying Service idt-daemon..."
kubectl apply -f ./idtdaemon.service.yml

echo "Resources for idt-daemon applied successfully."