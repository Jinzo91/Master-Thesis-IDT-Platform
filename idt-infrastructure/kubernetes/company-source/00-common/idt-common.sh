echo "Applying idtCompanySource-common..."

echo "Creating namespace..."
kubectl apply -f ./companySource.namespace.yml

echo "Creating TLS secret"
kubectl create secret tls idt-tls-secret --key /var/lib/rbg-cert/live/host:intum:vmkrcmar102.privkey.pem --cert /var/lib/rbg-cert/live/host:intum:vmkrcmar102.cert.pem -n company-source

SA_PASSWORD=$(kubectl get secrets/mssql --namespace=company-source -o go-template='{{ .data.SA_PASSWORD | base64decode }}')

echo $SA_PASSWORD

if [[ -z $SA_PASSWORD ]]
then
    echo "Generate MSSQL Password..."
    kubectl create secret generic mssql --from-literal=SA_PASSWORD="IDTRocks2019!" --namespace=company-source

    echo "Applying Secret idtcr..."
    kubectl apply -f ./idtcr.secret.yml

    echo "Resources for company-source-common applied successfully."
else
    echo "Secrets already applied, skipping step."
fi
