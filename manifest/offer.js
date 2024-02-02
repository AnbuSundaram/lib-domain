const createDomain = require('../lib/create-domain')

module.exports = createDomain('offer', {
  offlinePort: 4061,
  lambdaPort: 3016,
  private: true,
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        'lambda:InvokeFunction',
        'secretsmanager:GetResourcePolicy',
        'secretsmanager:GetSecretValue',
        'secretsmanager:DescribeSecret',
        'secretsmanager:ListSecretVersionIds'
      ],
      Resource: '*'
    }
  ]
})
