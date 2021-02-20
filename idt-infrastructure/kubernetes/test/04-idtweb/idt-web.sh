echo "Applying idt-web..."

echo "Applying Deployment idt-web..."
kubectl apply -f ./idtweb.deployment.yml

echo "Applying Service idt-web..."
kubectl apply -f ./idtweb.service.yml

echo "Resources for idt-web applied successfully."