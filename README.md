# GEVS - General Election Voting System 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setting up the database system 

NOTE: make sure to have mysql workbench and mysql command line client installed in the system.

In the .env file make sure to set up the root password as per your database.




```

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=SETUP YOUR OWN DB PASSWORD
DB_DATABASE=gevs
DB_PORT=3306
SECRET_KEY=33036e729957243d3038400d7901cba42063be94db028756126f5b92245d52d0

```

<b> NOTE: .env is exposed here for demonstration purposes and just for try/ testing purposes. Displaying credentials for security is not advisable/ </b> 

IMPORTANT: To make connection successful make sure the database schema gevs is created and your own root password for database is setup.

The gevs database schema format is set to utf8 while creating the gevs database in Charset/Collation tab of mysql workbench.

After tables are created, open a new terminal and paste the code below in VS code -

### In command line Windows (VS Code) 

cmd.exe /c "mysql -u root -p gevs < sg691.sql"


This command should push the sql script inside the database schema 'gevs'

## Starting the project 

Install all the packages using ``` npm install ```

This project uses concurrently to start the  node.js server as well as the React project at the same time.

Use `npm start` to start the project

This would open http://localhost:3000 in the web browser.

This project uses 2 ports 

- Port 3000 for the application
- Port 3001 for the server


## REST API calls and results 


### See live election results 


API Call link -   http://localhost:3001/gevs/results


#### When election is ongoing

result -


```

{
  "status": "Pending",
  "winner": "Pending",
  "seats": [
    {
      "party": "Blue Party",
      "seat": 1
    },
    {
      "party": "Red Party",
      "seat": 1
    },
    {
      "party": "Yellow Party",
      "seat": 1
    },
    {
      "party": "Independent",
      "seat": 0
    }
  ]
}




```


#### When election is completed


result -


```

{
  "status": "Completed",
  "winner": "Yellow Party",
  "seats": [
    {
      "party": "Blue Party",
      "seat": 1
    },
    {
      "party": "Red Party",
      "seat": 1
    },
    {
      "party": "Yellow Party",
      "seat": 3
    },
    {
      "party": "Independent",
      "seat": 0
    }
  ]
}



```


### Votes per constituency, per candidate, per party



API Call link -   http://localhost:3001/gevs/constituency/northern-kunlun-mountain

``` northern-kunlun-mountain``` could be replaced with any constitutional name



Result -


```


{
  "constituency": "northern-kunlun-mountain",
  "result": [
    {
      "name": "Candidate 5",
      "party": "Blue Party",
      "vote": 0
    },
    {
      "name": "Candidate 6",
      "party": "Red Party",
      "vote": 0
    },
    {
      "name": "Candidate 7",
      "party": "Yellow Party",
      "vote": 3
    },
    {
      "name": "Candidate 8",
      "party": "Independent",
      "vote": 0
    }
  ]
}



```






