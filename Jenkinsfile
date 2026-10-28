pipeline {
    agent any

    tools {
        nodejs 'NodeJS-26' 
    }

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'example'],
            description: 'Select the environment to run Playwright tests against'
        )
    }

    triggers {
        // Changed to pollSCM since githubPush requires specific webhook configurations/plugins
        pollSCM('H/5 * * * *') 
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Run Tests') {
            steps {
                // Uses the environment dropdown parameter selected in Jenkins UI
                bat "npx cross-env ENV=${params.ENVIRONMENT} npx playwright test"
            }
        }
    }

    post {
        always {
            // Fixed HTML publisher parameters (removed invalid stripArchive)
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report'
            ])
        }
    }
}