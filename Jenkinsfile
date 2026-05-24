pipeline {
    agent any

    stages {

        stage('Check Docker') {
            steps {
                sh 'docker --version'
            }
        }

        stage('Show Project Files') {
            steps {
                sh 'ls -la'
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    sh 'docker build -t deployflow-backend .'
                }
            }
        }

        stage('Deploy Backend Container') {
            steps {
                sh '''
                docker stop deployflow-app || true
                docker rm deployflow-app || true

                docker run -d \
                  --name deployflow-app \
                  -p 5001:5000 \
                  deployflow-backend
                '''
            }
        }
    }
}
