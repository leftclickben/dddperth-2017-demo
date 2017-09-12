# dddperth-2017-demo

Demonstration material for DDD Perth 2017 presentation: 'Serverless Architecture at the Small Scale'

Requires NodeJS and Serverless:

```
npm install -g serverless
```

Then install local dependencies:

```
npm install
```

Because S3 bucket names are globally unique, you will need to choose new bucket names.  This requires a change in
`serverless.yml`, and in `app/config.json`.  An easy method is to change "leftclick" with your own name or moniker.

You might also need to change the notification preferences in `app/config.json`.

Set up your AWS account and credentials, set the `AWS_PROFILE` environment variable, and then you can deploy:

```
sls deploy
```
