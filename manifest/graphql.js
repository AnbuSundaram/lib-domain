const createDomain = require('../lib/create-domain')

module.exports = createDomain('graphql', {
  lambdaPort: 3004,
  offlinePort: 4444,
  public: true,
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        'secretsmanager:GetResourcePolicy',
        'secretsmanager:GetSecretValue',
        'secretsmanager:DescribeSecret',
        'secretsmanager:ListSecretVersionIds',
        "ses:SendRawEmail",
        'lambda:listAliases',
        'lambda:listVersionsByFunction',
        'lambda:deleteFunction',
        'lambda:listLayerVersions',
        'lambda:deleteLayerVersion'
      ],
      Resource: '*'
    }
  ]
})
