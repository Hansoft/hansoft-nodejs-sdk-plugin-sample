// Determine which operating system the sample runs on so that it pulls the correct path
const getOperatingSystemPath = () => {
    if (process.platform === 'win32') {
        return 'Win32';
    } else if (process.platform === 'darwin') {
        return 'OSX';
    } else {
        return 'Linux';
    }
}

// This method is specific for MacOS. Determine which operating architecture the sample runs on so that it pulls the correct path of the SDK.
const getSDKArchitecturePath = () => {
    if (process.platform === 'darwin') {
        if (process.arch === 'x64') {
            return 'NodeSdkx64';
        } else {
            return 'NodeSdkarm64'
        }
    } else {
        return 'NodeSdkx64';
    }
}

// If trying to make this example work through the github example make sure that the path to the SDK is modified accordingly.
const hansoftSDK = require(`../../../${getOperatingSystemPath()}/${getSDKArchitecturePath()}/lib/HPMSdkNode.node`);

// In this class you can specify all the SDK callbacks you want to receive when updates happen in the database.
class Callback extends hansoftSDK.HPMSdkCallbacks {
    // Format of the callback function names should be: On_{Action_Performed}. See below.

    // This function will be fired each time a task change is made in the database. And return its ID the field Enum which was changed and the ResourceID which made the change.
    On_TaskChange(_Data) {
       console.log(`Task with ID: ${_Data.m_TaskID.m_ID} was changed`);
       console.log(`Task field which was changed: ${_Data.m_FieldChanged}`);
       console.log(`Changed by resource: ${_Data.m_ChangedByResourceID}`);
    };
}

const main = async () => {
    // You should change these parameters to match your development server and the SDK account you have created. For more information see SDK documentation.
    const dllPath = `../../../${getOperatingSystemPath()}`;
    const sdkDebug = true;
    const hostname = 'localhost';
    const port = 50255;
    const database = 'Company_Projects';
    const sdkUser = 'SDK';
    const sdkPassword = 'hpmadm';
    const callback = new Callback();

    // Open a SDK Session
	const session = hansoftSDK.HPMSdkSession.sessionOpen(
        hostname,
        port,
        database,
        sdkUser,
        sdkPassword,
        callback,
        () => { session.sessionProcess(); },
        sdkDebug,
        0,
        './VersionControlFiles',
        dllPath,
        null,
    );

    // Get the users stored in the database
    const resources = await session.resourceEnum();

    if(resources.m_Resources.length > 0) {
        // Loop through all the users stored in the database.
        for (let resourceID of resources.m_Resources) {
            console.log(`\n`);
            // Get each user's properties
            const userProperties = await session.resourceGetProperties(
                resourceID,
            );
            console.log(`User: ${userProperties.m_Name}`);

            // Get all the task references assigned to a user
            const taskReferences = await session.taskRefEnum(resourceID);
            console.log(`Amount of tasks assigned to the user: ${taskReferences.m_Tasks.length}`);

            // If the user doesn't have any assigned tasks end iteration.
            if (taskReferences.m_Tasks.length === 0) {
                continue;
            }

            // Get the task from the taskReference
            const firstTask = await session.taskRefGetTask(taskReferences.m_Tasks[0]);

            // Get the description of the first task assigned to the user
            let taskDescription = await session.taskGetDescription(firstTask);
            console.log(`Task description: ${taskDescription}`);

            // Get the assignedTo column of the task
            const assignedToID = await session.taskGetResourceAllocation(firstTask);

            // Check if the task is not assigned to anybody
            if (assignedToID.m_Resources.length === 0) {
                console.log(`Task ${taskDescription} is not assigned to anyone`);
                continue;
            }

            //Get the properties of The assignedToID
            const resourceProperties = await session.resourceGetProperties(
                assignedToID.m_Resources[0].m_ResourceID,
            );
            console.log(`Task is assigned to: ${resourceProperties.m_Name}`);
        }
    } else {
        console.log(`The database doesn't contain any users yet`);
    }

    // Make sure the session stops before closing the script
    await session.sessionStop();
}
main().catch((error) => {
    console.error(error);
});