echo "Tearing down namespace idt..."

kubectl delete all --all -n idt
kubectl delete namespace idt

echo "Teardown successfull."