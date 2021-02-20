## Environment
We are using the following tools to apply a single node kubernetes cluster in our environment. The kubernetes deployments can be used for a multi-node cluster relatively easy.
- For the scope of the project we used [Ubuntu 18.04 LTS](https://ubuntu.com/download/desktop) machines.
- To get k8s running easily, and furthermore, in a single-node cluster [microK8s](https://microk8s.io/) is one of the easiest solutions.
- If you plan to use your SSH keys with Azure Pipelines, make sure you generate your keypair with the `-m PEM` parameter: `ssh-keygen -t rsa -m PEM`.

### Configure VM for k8s
1. Setup SSH keypair and tunnel into VM. If you are using Azure Pipelines you can setup a new Service Connection (Use a keypair with the `-m PEM` parameter: `ssh-keygen -t rsa -m PEM`), and reconfigure pipelines or setup a new stage.
2. Install microk8s: `snap install microk8s --classic`.
3. Set alias for `kubectl`: `snap alias microk8s.kubectl kubectl`.
4. Start your cluster with `microk8s.start`. Later you can get the clusters status with `microk8s.status`, or stop the cluster with `microk8s.stop`.
5. Set permissions for user using `sudo usermod -a -G microk8s $USER_NAME`.
6. Enable microk8s storage addon: `microk8s.enable storage`.
7. Enable microk8s ingress addon: `microk8s.enable ingress`.
8. Install SQL command line tools by following the [documentation](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-setup-tools?view=sql-server-ver15#ubuntu).
9. Add `export PATH="$PATH:/opt/mssql-tools/bin"` and `export PATH="$PATH:/snap/bin"` to the top of your `.bashrc` file. Run `source .bashrc` afterwards.

### Apply kubernetes cluster
1. Copy the files from the kubernetes folder and run `bash apply.sh` or use the preconfigured Azure Pipelines with your new Service Connection.