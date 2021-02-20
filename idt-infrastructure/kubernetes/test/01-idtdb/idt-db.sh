echo "Applying idt-db..."

echo "Applying PersistentVolumeClaim mssql-claim..."
kubectl apply -f ./mssql.claim.yml

echo "Waiting for Storage to be provisioned..."
sleep 5s

echo "Applying Deployment idtdb..."
kubectl apply -f ./idtdb.deployment.yml

echo "Applying Service idtdb..."
kubectl apply -f ./idtdb.service.yml

echo "Getting Node IP..."
NODE_INTERNAL_IP=$(kubectl get nodes --namespace=idt -o jsonpath='{ $.items[*].status.addresses[?(@.type=="InternalIP")].address }')
echo "Node IP is:"
echo $NODE_INTERNAL_IP

echo "Waiting for MSSQL Database to be provisioned..."
sleep 60s

echo "Creating domain database..."
SA_PASSWORD=$(kubectl get secrets/mssql --namespace=idt -o go-template='{{ .data.SA_PASSWORD | base64decode }}')
sqlcmd -S $NODE_INTERNAL_IP,30012 -U SA -P $SA_PASSWORD -Q "CREATE DATABASE idt"
echo "Database created."

echo "Resources for idt-db applied successfully."