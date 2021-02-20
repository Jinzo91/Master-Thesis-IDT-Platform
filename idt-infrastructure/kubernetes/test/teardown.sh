echo "Tearing down namespace idt..."

kubectl delete all --all -n idt-test
kubectl delete namespace idt-test

echo "Teardown successfull."