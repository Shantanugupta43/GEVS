# GEVS - General Election Voting System 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## QR codes to try -

Note - The QR code could be used with registration only once. Please feel free to try with other QR codes if already used. 

QR - codes

- HH64FWPE
- BBMNS9ZJ
- KYMK9PUH
- WL3K3YPT
- JA9WCMAS
- Z93G7PN9
- WPC5GEHA
- RXLNLTA6
- 7XUFD78Y
- DBP4GQBQ
- ZSRBTK9S
- B7DMPWCQ
- YADA47RL
- 9GTZQNKB
- KSM9NB5L
- BQCRWTSG
- ML5NSKKG
- D5BG6FDH
- 2LJFM6PM
- 38NWLPY3
- 2TEHRTHJ
- G994LD9T
- Q452KVQE
- 75NKUXAH
- DHKVCU8T
- TH9A6HUB
- 2E5BHT5R
- 556JTA32
- LUFKZAHW
- DBAD57ZR
- K96JNSXY
- PFXB8QXM
- 8TEXF2HD
- N6HBFD2X
- K3EVS3NM
- 5492AC6V
- U5LGC65X
- BKMKJN5S
- JF2QD3UF
- NW9ETHS7
- VFBH8W6W
- 7983XU4M
- 2GYDT5D3
- LVTFN8G5
- UNP4A5T7
- UMT3RLVS
- TZZZCJV8
- UVE5M7FR
- W44QP7XJ
- 9FCV9RMT
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

<b> NOTE: .env is exposed here for demonstration purposes and just for try/ testing purposes. Displaying credentials for security is not advisable! </b> 

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






