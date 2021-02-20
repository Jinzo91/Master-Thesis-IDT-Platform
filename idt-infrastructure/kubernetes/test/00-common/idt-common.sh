echo "Applying idt-common..."

echo "Creating namespace..."
kubectl apply -f ./idt.namespace.yml

SA_PASSWORD=$(kubectl get secrets/mssql --namespace=idt-test -o go-template='{{ .data.SA_PASSWORD | base64decode }}')

echo $SA_PASSWORD

if [[ -z $SA_PASSWORD ]]
then
    echo "Generate MSSQL Password..."
    kubectl create secret generic mssql --from-literal=SA_PASSWORD="IDTRocks2019!" --namespace=idt-test

    echo "Applying Secret idtcr..."
    kubectl apply -f ./idtcr.secret.yml

    echo "Resources for idt-common applied successfully."
else
    echo "Secrets already applied, skipping step."
fi