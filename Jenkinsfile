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
    }
}
