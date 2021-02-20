echo "Applying idt-documentdb..."

echo "Applying PersistentVolumeClaim mssql-claim..."
kubectl apply -f ./idtdocumentdb.claim.yml


echo "Waiting for Storage to be provisioned..."
sleep 5s


echo "Applying Deployment idt-documentdb..."
kubectl apply -f ./idtdocumentdb.deployment.yml

echo "Applying Service idt-documentdb..."
kubectl apply -f ./idtdocumentdb.service.yml


echo "Waiting for Document Database to be provisioned..."
sleep 60s


echo "Resources for idt-documentdb applied successfully."