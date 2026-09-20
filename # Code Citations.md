# Code Citations

## License: MIT
https://github.com/dikshaTomar/helloworld/tree/1dbc240420260f0ecfef1065dfed045aaac11798/.github/workflows/main.yml

```
on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
```

## License: MIT
https://github.com/Hybola/frontend-CICD/tree/489ed5fc3aa1c2cbad6b6e5aa87494216c039ae4/.github/workflows/action.yml

```
Pipeline

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
```

## License: MIT
https://github.com/B-atuti/React_app/tree/360f25672bfd8b4b0d3fa105cfdaf0a608bcdf1a/app/github/workflows/workflow.yml

```
on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
```

## License: MIT
https://github.com/soloveiiko/bubu-store/tree/061babd1e674b8264a1071fd1c3afb8e98f16c3c/.github/workflows/build-css.yml

```
on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'

    - name: Install dependencies
      run: npm install
```

## License: MIT
https://github.com/elvinsavio/stamps/tree/b1b08db61de8c51ae057d5dda7ce70500cd64bc8/.github/workflows/main.yml

```
on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'

    - name: Install dependencies
      run: npm install
```
