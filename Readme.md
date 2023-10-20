# sfdx-xy-plugin

- a plugin for sfdx developer
- [sfdx-password-login](https://github.com/exiahuang/sfdx-password-login)
- work with vscode-plugin [xysfdx](https://github.com/exiahuang/xysfdx)

## Install

Install as sfdx plugin

```sh
# install
sfdx plugins:install sfdx-xy-plugin

# show plugin
sfdx plugins

# run
sfdx xy --help
```

# Usage

## sobject CURD

USAGE
```
sf xy data create --help
sf xy data delete --help
sf xy data update --help
sf xy data upsert --help
sf xy data query --help
sf xy data search --help
sf xy data q --help

```

## deploy metadata

USAGE
```
  $ sfdx xy:deploy -k <string> [-d <string>] [-c <string>] [-n] [-s] [-e] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]
```

OPTIONS
```
  -c, --cwd=cwd                                                                     [default: .] current working directory
  -d, --directory=directory                                                         [default: force-app] root directory
  -e, --execute                                                                     execute deploy
  -k, --keyword=keyword                                                             (required) pattern of keyword.
  -n, --nodir                                                                       nodir
  -s, --sensitive                                                                   case sensitive

  -u, --targetusername=targetusername                                               username or alias for the target org; overrides default target
                                                                                    org

  --apiversion=apiversion                                                           override the api version used for api requests made by this
                                                                                    command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for this command invocation
```

EXAMPLES
```
  sfdx xy:deploy --keyword hello*.cls
  sfdx xy:deploy --keyword hello*.cls --execute
  sfdx xy:deploy --keyword hello*.cls --directory force-app --execute
  sfdx xy:deploy --keyword hello*.cls --directory force-app --execute --sensitive
  sfdx xy:deploy -k hello*.cls
  sfdx xy:deploy -k hello*.cls -e
  sfdx xy:deploy -k hello*.cls -d force-app -e
  sfdx xy:deploy -k hello*.cls -d force-app -e -s
```
## deploy metadata from git diff

deploy metadata from git, default use git diff HEAD

USAGE
```
  $ sfdx xy:git:deploy [-a <string>] [-b <string>] [-c <string>] [-e] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]
```

OPTIONS
```
  -a, --branch1=branch1                                                             branch1 name
  -b, --branch2=branch2                                                             [default: HEAD] branch2 name
  -c, --commitid=commitid                                                           commit id
  -e, --execute                                                                     execute deploy
  -u, --targetusername=targetusername                                               username or alias for the target org; overrides default target org
  --apiversion=apiversion                                                           override the api version used for api requests made by this command
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for this command invocation
```

EXAMPLES
```
# use git stage file to build/run deploy script
  sfdx xy:git:deploy
  sfdx xy:git:deploy -e
  sfdx xy:git:deploy --execute

# use git commit id to build/run deploy script
  sfdx xy:git:deploy -c $commit_id
  sfdx xy:git:deploy --commitid $commit_id

# use git diff result to build/run deploy script
  sfdx xy:git:deploy -a $branch1 -b $branch2
  sfdx xy:git:deploy --branch1 $branch1 --branch2 $branch2
  sfdx xy:git:deploy --branch1 $branch1 --branch2 $branch2 --execute
```

## retrieve metadata

USAGE
```
  $ sfdx xy:retrieve -k <string> [-d <string>] [-c <string>] [-n] [-s] [-e] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]
```

OPTIONS
```
  -c, --cwd=cwd                                                                     [default: .] current working directory
  -d, --directory=directory                                                         [default: force-app] root directory
  -e, --execute                                                                     execute deploy
  -k, --keyword=keyword                                                             (required) pattern of keyword.
  -n, --nodir                                                                       nodir
  -s, --sensitive                                                                   case sensitive

  -u, --targetusername=targetusername                                               username or alias for the target org; overrides default target
                                                                                    org

  --apiversion=apiversion                                                           override the api version used for api requests made by this
                                                                                    command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for this command invocation
```

EXAMPLES
```
  sfdx xy:retrieve --keyword hello*.cls
  sfdx xy:retrieve --keyword hello*.cls --execute
  sfdx xy:retrieve --keyword hello*.cls --directory force-app --execute
  sfdx xy:retrieve --keyword hello*.cls --directory force-app --execute --sensitive
  sfdx xy:retrieve -k hello*.cls
  sfdx xy:retrieve -k hello*.cls -e
  sfdx xy:retrieve -k hello*.cls -d force-app -e
  sfdx xy:retrieve -k hello*.cls -d force-app -e -s
```

## bulk apex test runner

USAGE
```
  $ sfdx xy:test:run -k <string> [-d <string>] [-s] [-e] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]
```

OPTIONS
```
  -d, --directory=directory                                                         [default: force-app] root directory
  -e, --execute                                                                     execute apex test command
  -k, --keyword=keyword                                                             (required) pattern of keyword.
  -s, --sensitive                                                                   case sensitive
  -u, --targetusername=targetusername                                               username or alias for the target org; overrides default target org
  --apiversion=apiversion                                                           override the api version used for api requests made by this command
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for this command invocation
```

EXAMPLES
```
  sfdx xy:test:run --keyword hello* --execute
  sfdx xy:test:run -k hello* -e
```

# For Developer

## Install from source

```sh
git clone https://github.com/exiahuang/sfdx-xy-plugin.git
cd sfdx-xy-plugin
npm install
sfdx plugins:link .
```

## just run it

```
./bin/run xy:auth:username:login
```

# Acknowledgement

-   [Create Your First Salesforce CLI Plugin](https://developer.salesforce.com/blogs/2018/05/create-your-first-salesforce-cli-plugin.html)
