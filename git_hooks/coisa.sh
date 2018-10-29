parallel (
    "stream 1" : {
		node('salicTreinamentoN1') {
		    echo 'iniciando rotina de push VerSnc'
		    sh '''rootDirectory="/var/www"
			projectDirectory="$rootDirectory/var/app"


		    cd "$projectDirectory"
		    git fetch
		    git checkout $branch
			git pull origin $branch'''
		}
	},
)
