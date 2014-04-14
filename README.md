# SharePoint Bridge


SharePoint bridge is aimed to bring an Office365 multiplatform synchronisation client built on node-webkit. This app runs on Linux / Mac & Windows and encompasses Claims Authentication for SharePoint Online.


# Release Notes



## Getting Started

- 1. In the application root, execute **npm install && grunt install**. Node-Webkit will be installed locally under ```cache/<platform>/<version>```.
- 2. To run your application, execute **grunt run**.


## Next Steps

- Integration of sharepoint service for managing authentication through Azure STS
- Store Cookies for subsequent calls
- UI for adding a new workspace / folder to sync
- Sync settings (Eager / Lazy (?))
- Choose between webdav and SharePoint Restful API for synchronizing files
- Define an approach retetien for User's credentials and whether or not we can renew its tokens  on behalf of him


## More Details

The application is launch and index.html is loaded. Grunt uses LESS to render all stylesheets. The default stylesheet is located in
./css/app.less and includes bootstrap 3.0. No need to add bootstrap, you just get all bootstrap controls, grid and features. We're declaring the ng-view element which will act as a placeholder
for Angular views. After that, we bootstrap require.js by loading the  js/main.js file. No other JS files are loaded statically. Everything else is loaded through require.js as described
in main.js

main.js contains standard require.js configuration entries. We define all libraries that are declared in bower.json in the paths section. We delare a few shims to add require.js support to
non-compatible libraries. We also define dependencies to help require.js load all libraries in the right order. This reduces also the number of dependencies you have to state in your own
modules. The control is then passed to the bootstrap module, which will launch the angular application and start loading all application specific modules. The bootstrap load angular an
Angular application called **app***, which is defined in ./js/app.js.

app.js is a standard Angular 1.2 application, loading all dependent modules to get services, controllers, etc.

Each Angular component is defined in its own file and dynamically injected when you need it using require.js. The same pattern is used for all components, an index.js file, loaded by require.js,
declares all component files. This ensures that all files are loaded automatically. Each Angular component file is a require.js module, which declares the actual Angular component.

## Navigation

Application navigation is powered by the angular-ui-router module. This module manages hierarchical ui state and offer a very powerful way to structure complex ui. For example, we now support
nested views and multi views (multiple ui-view placeholder in the application). This is much more aligned with common desktop app needs.

### Declaring a new state
A state is a particular location in the application UI. We have grouped all routes into the app.states module (js/states/main.js). The main file contains top-level states that can be referenced
from anywhere in controllers by using `$state.go('signup')`. You can added more top-level states in this file or create additional files (dialogs.js, security.js) to group new state together. Just
remember to add your file to the dependency list of the index.js file. Follow the main.js structure and your new state will be available in your application.

## Menus

Menubar and contextual menus are now supported directly in the nwService. The benefits of using the service are :

- Capacity to create a full menu structure in a single call (see node-webkit.js service)
- Integration with Angular by providing an event name as 'click' value. When the user click the menu, the $rootScope will $broadcast your event name, so it's easy for
you to register $on(eventName) handlers in any of your scope. You should register your handlers in the AppCtrl for the menubar and directly in your local controller for contextual menus.

## Packaging

To package your application, simply run **grunt build** from the application root.

Check ```releases/<platform>``` for the finished product.

