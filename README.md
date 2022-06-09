## SDK NodeJS sample.

In the sample HansoftNodeSDKSample.js by using the SDK the script fetches the todo list of all the users stored in the database.
It also fetches the assigned to field of a task and it's description.

## Prerequisites

* NodeJS installed preferably the LTS version. [NodeJS](https://nodejs.org/en/)
* A Hansoft server running with a database online and an SDK user created. [Hansoft server](https://www.perforce.com/downloads/hansoft-server) version 11 or higher.
* [Hansoft SDK](https://www.perforce.com/downloads/hansoft-sdk) installed  version 11.004 or higher.
* In order to be able to create SDK users a valid non-trial license should be applied to the server. In order to acquire one you can contact [sales@perforce.com](mailto:sales@perforce.com)

## To run the sample

* Make sure the hansoft server is running, the database is online and an SDK user is created.
* Read the code in `src/HansoftNodeSDKSample.js` and make the neccessary changes to point to the path of the installed SDK, server port, database and SDK user credentials according to your setup.
* Run the script by executing the command: `node HansoftNodeSDKSample.js` from the src directory.


For any issues or questions feel free to open a github issue on this repository

