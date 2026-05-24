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

        stage('Backend Build') {
            steps {
                dir('backend') {
                    sh 'docker compose build'
                }
            }
        }
    }
}
