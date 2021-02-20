echo "Applying Ingress..."

FQDN="$(hostname -f)"

if [[ $FQDN == *"vmkrcmar68."* ]]
then
    echo "Apllying prod ingress controller..."
    kubectl apply -f ./ingress.prod.controller.yml
else
    echo "Apllying dev ingress controller..."
    kubectl apply -f ./ingress.dev.controller.yml
fi

echo "Resources for idt-ingress applied successfully."


# vmkrcmar68.in.tum.de