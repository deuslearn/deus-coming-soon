pipeline {
    environment {
        image = "$registry/deus-homepage"
        dockerImageObj = ""
        version="v0.0.$BUILD_NUMBER"
    } 
    agent any 
    stages {
        stage("Building Image") {
            steps {
                script {
                    dockerImageObj = docker.build("$image:$version")
                }
            }
        }
        stage("Deploy Image") {
            steps {
                script {
                    dockerImageObj.push(version)
                }
            }
        }
        stage("Remove Unused Docker Image") {
            steps {
                sh "docker rmi $image:$version"
            }
        }
    }
    stages {
        stage('Deploy on Cloud Run'){
            steps {
                sh '''
                    gcloud run deploy deus-homepage \
                    --image=$image:$version \
                    --port=8080 \
                    --set-env-vars=NODE_ENV=$nodeenv \
                    --platform=managed \
                    --region=us-central1 \
                    --no-allow-unauthenticated \
                    --vpc-connector=deus-serverless-vpc \
                    --vpc-egress=all
                '''
            }
        }
    }
}