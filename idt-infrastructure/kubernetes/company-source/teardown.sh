echo "Tearing down namespace company-source..."

kubectl delete all --all -n company-source
kubectl delete namespace company-source

echo "Teardown successfull."
