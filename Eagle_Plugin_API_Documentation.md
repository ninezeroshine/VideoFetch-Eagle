# 🦅 Eagle Plugin API — Complete Documentation

> *Full reference for the Eagle Plugin API, scraped from [developer.eagle.cool](https://developer.eagle.cool/plugin-api/)*

> *Generated automatically*


---

## 📑 Table of Contents


### 🚀 Getting Started

- [Introduction](#introduction)
- [Your First Plugin](#your-first-plugin)
- [File Structure Overview](#file-structure-overview)
- [Plugin Types](#plugin-types)
- [Debug Plugin](#debug-plugin)

### 📦 Distribution

- [Prepare Plugin](#prepare-plugin)
- [Package Plugin](#package-plugin)
- [Publish Plugin](#publish-plugin)
- [Update Plugin](#update-plugin)
- [Developer Policies](#developer-policies)

### 📖 Developer Guide

- [manifest.json Configuration](#manifestjson-configuration)
- [Retrieve Data](#retrieve-data)
- [Modify Data](#modify-data)
- [Access Local Files](#access-local-files)
- [Issue Network Requests](#issue-network-requests)
- [Using Node.js Native API](#using-nodejs-native-api)
- [Using Third-Party Modules](#using-third-party-modules)
- [Multilingual (i18n)](#multilingual-i18n)
- [Frameless Window](#frameless-window)

### 🔧 API Reference

- [API: event](#api-event)
- [API: item](#api-item)
- [API: folder](#api-folder)
- [API: tag](#api-tag)
- [API: tagGroup](#api-taggroup)
- [API: library](#api-library)
- [API: window](#api-window)
- [API: app](#api-app)
- [API: os](#api-os)
- [API: screen](#api-screen)
- [API: notification](#api-notification)
- [API: contextMenu](#api-contextmenu)
- [API: dialog](#api-dialog)
- [API: clipboard](#api-clipboard)
- [API: drag](#api-drag)
- [API: shell](#api-shell)
- [API: log](#api-log)

### 🧩 Extra Modules

- [FFmpeg](#ffmpeg)
- [AI SDK](#ai-sdk)
- [AI Search](#ai-search)

### 📋 Changelog

- [Changelog](#changelog)


---


---

# 🚀 Getting Started


## Introduction

*Source: [https://developer.eagle.cool/plugin-api/](https://developer.eagle.cool/plugin-api/)*

# Introduction
This document aims to provide a comprehensive and easy-to-understand guide for developers who want to use the Eagle Plugin API to develop plugins.
Hello and Welcome to the Eagle Plugin API. By using our API, developers can easily expand the functionality of Eagle applications. We hope that by providing an open API, we can give developers more creative space to enrich the plugin ecosystem of Eagle applications.
* * *
Plugin Types
First, let's introduce the four types of Eagle plugins:
  1. **Window Plugin** These plugin are executed when the user clicks on them and open a plugin window. These plugins can provide interactive functionality with the user.
  2. **Background Service Plugin** These plugin automatically open in the background as the application starts up and reside in the system background.
  3. **Format Extension Plugin** These plugin are used to enhance or extend file formats that Eagle applications do not support, including thumbnail displays, display tools, etc. These plugins allow users to open more file formats in Eagle applications, such as new image or video formats.
  4. **Inspector Extension Plugin** Enhances the functionality of the Eagle right-side inspector, allowing it to display corresponding data information for different file formats, such as additional attributes, previews, maps, EXIF information, and more.


Each of the above four types of plugins has its own purpose and characteristics. Depending on your needs, you can choose different types of plugins to achieve the desired functionality.
> ℹ️ **Info:**
Learn more：[Detailed Explanation of Plugin Types](https://developer.eagle.cool/plugin-api/get-started/plugin-types)
* * *
Based on Web Technology
Eagle Plugin is developed based on Web technology, using JavaScript language. By using the API, developers can create their own plugins and use Web technologies such as HTML, CSS, and JavaScript to extend the browser's functionality.
In addition, the Eagle Plugin API is not affected by cross-domain restrictions (CORS), so it can access any URL. This feature is very useful because it allows plugins to access multiple different data sources, thus achieving more functionality.
Currently, the Eagle Plugin API is based on Chromium 107 and Node 16, so there is no need to consider webpage compatibility issues. Developers can use the latest Web technologies with confidence without worrying about compatibility issues on different browsers or operating systems.
* * *
Support for NodeJS native API and third-party modules
Eagle Plugin is a very powerful Web development plugin that not only supports various Web technologies but also supports Node.js native API and importing third-party modules. With these features, Eagle Plugin can help developers avoid reinventing the wheel while greatly improving development speed.
Support for Node.js native API. This means that developers can use various built-in features of Node.js, such as file systems, network operations, operating system services, etc. These features enable the application to perform more complex tasks, such as reading and writing files, processing network requests, implementing scheduled tasks, etc.
Support for importing third-party modules. This means that developers can directly use community-provided modules without having to reinvent the wheel themselves. This way, developers can focus more on implementing business logic without wasting time on repeating basic functionality.
> ℹ️ **Info:**
Learn More：
  * [Using Node.js Native API](https://developer.eagle.cool/plugin-api/tutorial/node-js-native-api)
  * [Using Third-Party Modules](https://developer.eagle.cool/plugin-api/tutorial/3rd-modules)


* * *
Eagle Plugin API
In addition to supporting the native Web/Node.js API, Eagle plugins can also use the plugin API provided by the Eagle application to access files and data in the application. This makes it easier to meet various requirements, such as:
  1. **Retrieve saved files** Retrieve the currently saved file and folder data in the Eagle application. This way, developers can easily access files and folders in the Eagle application and perform more operations.
  2. **Add or modify files** Add and modify data saved in the Eagle application. Developers can use this feature to add or modify data in the Eagle application and automatically save it.
  3. **Adjust plugin window** Adjust the width, height, position, and top of the Eagle application window. This way, developers can customize the interface of the Eagle application to better meet their needs.
  4. **Use the clipboard** Such as file copying and pasting. Developers can use these features to copy and paste files and other operations in the Eagle application to improve work efficiency.


In summary, the Eagle Plugin API provides a variety of features that allow developers to develop the applications they
> ℹ️ **Info:**
Learn more: [Eagle Plugin API Reference](https://github.com/eagle-app/eagle-plugin-document/blob/master/en-US/broken-reference/README.md)
* * *
Support and Appreciation
Although there are still many shortcomings in the Eagle plugin system, we are constantly working to improve it. If you have any ideas or suggestions, we very much welcome your feedback. Please contact us and let us work together to improve the plugin system and provide a better experience for users.
We look forward to your participation in building an even better plugin ecosystem!


## Your First Plugin

*Source: [https://developer.eagle.cool/plugin-api/get-started/creating-your-first-plugin](https://developer.eagle.cool/plugin-api/get-started/creating-your-first-plugin)*

# Your First Plugin
This article will guide you on how to create a plugin for Eagle.
Getting the Eagle Desktop Application
First, you need to install the Eagle desktop application. You can click here to download the installation program: <https://eagle.cool/download>[](https://eagle.cool/download). If you have already installed the Eagle desktop application, please make sure that you have updated to the latest version. We have added several features specifically to provide you with a better plugin development experience.
* * *
Create Plugin
  1. Click the "Plugin" button on the toolbar.
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FNXx3MFwyNYrD1D7SKxx6%252Fimage.png%3Falt%3Dmedia%26token%3D7d402b67-af44-40e5-bb4d-e8d53d676c7f&width=768&dpr=3&quality=100&sign=be363bf9&sv=2)
  2. In the pop-up menu, choose "Developer Options".
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FTRI2y6JbLCWLCa2Ru8iq%252Fimage.png%3Falt%3Dmedia%26token%3Dfb11e31d-6808-4185-b81d-4522f967b462&width=768&dpr=3&quality=100&sign=e626479b&sv=2)
  3. Click "Create Plugin". 
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FUhcRiJ0fKoYe73FHT6tv%252Fimage.png%3Falt%3Dmedia%26token%3Da23d7d9e-d987-465d-a43e-4432e45d6167&width=768&dpr=3&quality=100&sign=3dcbef5e&sv=2)
  4. In the new window, select the type of plugin you want to create, In this example We will choose "Window Plugin".
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FlzDqM5llEoGUzkiIfw0S%252Fimage.png%3Falt%3Dmedia%26token%3Dc2861665-96fc-4d4f-b58b-d4563550823e&width=768&dpr=3&quality=100&sign=2a6b8523&sv=2)
  5. Choose the location where you want to save the plugin, and then complete the creation.


If you want to learn more about the differences between different plugin types, you can refer to [this article](https://developer.eagle.cool/plugin-api/get-started/plugin-types). This information will help you determine which type of plugin is suitable for your needs.
* * *
Running the Example Plugin
  1. Click the "Plugin" button on the toolbar.
  2. In the pop-up menu, find the plugin you just created and click on it.
  3. You will see a window pop up, displaying the basic properties of the plugin.


* * *
Open the plugin directory in the code editor
The plugin project has been created successfully.
At this point, you can use Visual Studio Code or other code editors to open this folder. The plugin is composed of multiple files, and you need to edit these files simultaneously, so you need to open the entire folder, not just one of the files.
The next section will provide a detailed introduction to the file structure of the plugin.


## File Structure Overview

*Source: [https://developer.eagle.cool/plugin-api/get-started/anatomy-of-an-extension](https://developer.eagle.cool/plugin-api/get-started/anatomy-of-an-extension)*

# File Structure Overview
This article will provide a quick introduction to the files that may appear in a plugin project.
A plugin is an installation package that contains multiple files and can be directly distributed to users.
```
Plugin
├─ manifest.json
├─ logo.png
├─ index.html
└─ js
   └─ plugin.js
```

![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252Fgit-blob-4c0b26edd3a41213207a8b086b7d3e328789be3d%252Fimage%2520%2811%29.png%3Falt%3Dmedia&width=768&dpr=3&quality=100&sign=3a3b477f&sv=2)
* * *
manifest.json
This is a file that every plugin must have. It contains basic information about the plugin, such as the plugin's name, version, code entry point, etc. There are different configuration methods for different types of plugins. The following is the basic configuration for a "window plugin":
```
{
    "id": "LB5UL2P0Q9FFF",
    "version": "1.0.0",
    "name": "Hello World",
    "logo": "/logo.png",
    "keywords": ["keywrod1", "keywrod2"],
    "main":
    {
        "devTools": true,
        "url": "index.html",
        "width": 640,
        "height": 480
    }
}
```

  * `id` - Plugin ID
  * `version` - Plugin Version
  * `name` - Plugin Name
  * `logo` - Plugin Logo
  * `keywords` - Plugin Keyword, In addition to the plugin name, users can also use these keywords to quickly search for the plugin.
  * `main` - Plugin Window main entry
    * `url` - Entry Page
    * `width` - Window Width
    * `height` - Window Height


> ℹ️ **Info:**
**Note** : You can refer to [this article](https://developer.eagle.cool/plugin-api/tutorial/manifest) to learn about all the configuration methods for manifest.json.
> ℹ️ **Info:**
**Example code** :
<https://github.com/eagle-app/eagle-plugin-examples/tree/main/Window>[](https://github.com/eagle-app/eagle-plugin-examples/tree/main/Window)
logo.png
The logo field in the manifest.json corresponds to the plugin's icon, which will be used in the plugin list and the plugin center. Please provide an image with a resolution of 128 x 128 pixels. The icon should generally be in PNG format, as PNG provides the best support for transparency.
* * *
index.html
The main field in the manifest.json corresponds to the entry file of the plugin program. When the plugin is executed, index.html will be loaded independently and run in a separate browser window.


## Plugin Types

*Source: [https://developer.eagle.cool/plugin-api/get-started/plugin-types](https://developer.eagle.cool/plugin-api/get-started/plugin-types)*

# Plugin Types
This article will provide a detailed introduction to the development differences and use cases of the four different types of plugins.
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FB6l9J6UaYlKvtds3AV7P%252Fimage.png%3Falt%3Dmedia%26token%3D7dbb4c3a-2291-47a0-b21f-3a15599c6dbb&width=768&dpr=3&quality=100&sign=c98e825f&sv=2)
Eagle Plugin Types
The Eagle plugin system offers four different types of plugins, each with its own purpose and characteristics. You can choose different types of plugins based on your needs to implement the features you want, as shown in the table below:
Plugin Types
Use Cases
[Window](https://developer.eagle.cool/plugin-api/get-started/plugin-types/window)
One-time use, such as: one-click cutout, compression, format conversion, export, import, etc.
[Background Service](https://developer.eagle.cool/plugin-api/get-started/plugin-types/service)
Background running, such as: background synchronization, image analysis, etc.
[Format Extension](https://developer.eagle.cool/plugin-api/get-started/plugin-types/preview)
Enable Eagle to support more formats, provide thumbnail and double-click preview capabilities.
[Inspector](https://developer.eagle.cool/plugin-api/get-started/plugin-types/inspector)
Enhances the functionality of the right-side inspector for different file formats, adding extra properties, preview, map, etc.


## Debug Plugin

*Source: [https://developer.eagle.cool/plugin-api/get-started/debugging](https://developer.eagle.cool/plugin-api/get-started/debugging)*

# Debug Plugin
This article will provide a detailed explanation of effective methods for debugging and troubleshooting Eagle plugins.
Window Plugin Debug
After opening the plugin, press the F12 key to open the DevTools debugging tool.
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FMGg6WE08zUPf91TNYj4H%252Fimage.png%3Falt%3Dmedia%26token%3D744097d1-6a51-4c21-afbb-e726cc3811c6&width=768&dpr=3&quality=100&sign=6fc3c95c&sv=2)
DevTools
The specific steps are as follows:
  1. Open the plugin you want to debug in Eagle, and press the F12 key to open DevTools.
  2. In DevTools, you can view the plugin's code and use breakpoints and debugging tools to debug the plugin's execution process.
  3. You can also use other tools in DevTools to view information about the plugin's performance, memory usage, etc.


Debug Thumbnail Plugin
The thumbnail plugin runs in the background, and the code is only executed when files are added or updated. If you want to debug the thumbnail function code, you can set the devTools property to true in the manifest.json file and set debugger breakpoints in the code, which can then be debugged using devTools.
Debug Preview Plugin
Add and select the file format you want to develop in Eagle, open the plugin panel, click on the plugin you're developing, and a separate preview window will open. You can press `F12` to open `DevTools` for debugging.
> ℹ️ **Info:**
Learn more: If you are unsure how to use DevTools, you can refer to the following learning resources:
  1. Google official documentation: <https://developers.google.com/web/tools/chrome-devtools>[](https://developers.google.com/web/tools/chrome-devtools)
  2. MDN Web documentation: <https://developer.mozilla.org/zh-CN/docs/Tools>[](https://developer.mozilla.org/zh-CN/docs/Tools)
  3. W3Schools tutorial: <https://www.w3schools.com/js/js_debugging.asp>[](https://www.w3schools.com/js/js_debugging.asp)


Log System
> ⚠️ **Warning:**
Please note: The preview and thumbnail plugins currently do not support the log API.
A logging system is a tool used to record the running status of software, helping developers to locate and solve problems more quickly. The logging system records software error information, warning information, runtime information, etc., and can be used as a debugging tool. In a non-development environment, the logging system effectively helps developers identify the causes of problems and take measures to solve them.
Eagle Plugin API provides a [log functionality](https://developer.eagle.cool/plugin-api/api/log) to record plugin runtime information. This way, developers can record the plugin's running, warnings, errors, and other information in Eagle's software logs. By using this feature, developers can view this information by only providing a debug report to the user. While developing plugins, the logging feature helps developers to quickly locate and solve problems.
```
eagle.log.debug('debug message from plugin');
eagle.log.info('info message from plugin');
eagle.log.warn('warn message from plugin');
eagle.log.error('error message from plugin');

// [13:19:39.845] [debug] [plugin] "debug message from plugin"
// [13:19:39.845] [info] [plugin] "info message from plugin"
// [13:19:39.845] [warn] [plugin] "warn message from plugin"
// [13:19:39.845] [error] [plugin] "error message from plugin"
```

> ℹ️ **Info:**
Learn More: [Log - API Reference](https://developer.eagle.cool/plugin-api/api/log)
> ℹ️ **Info:**
Click here to view Eagle's [software log](https://docs-cn.eagle.cool/article/92-how-do-i-get-the-error-log) acquisition method.


---

# 📦 Distribution


## Prepare Plugin

*Source: [https://developer.eagle.cool/plugin-api/distribution/prepare](https://developer.eagle.cool/plugin-api/distribution/prepare)*

# Prepare Plugin
Some suggestions to read before publishing your plugin.
> ℹ️ **Info:**
Before publishing your plugin, please make sure it complies with our [Eagle Developer Policies](https://developer.eagle.cool/plugin-api/distribution/developer-policies).
Plugin Naming
Plugin naming should at least meet the following criteria:
  * **Clear Naming** The name of the plugin should clearly reveal its main function or purpose, allowing users to immediately understand the purpose of the plugin when browsing. For example, a plugin that helps users organize bookmarks can be named "Bookmark Master" instead of using vague names like "Super Tool".
  * **Word Limit** To ensure the simplicity of the plugin name, we recommend that the plugin name should not exceed 30 characters or 6 words. A name that is too long may confuse users and affect the display of the plugin in the list.
  * **Nouns Instead of Verbs** The name of the plugin should be mainly nouns, not verbs. This can help users better understand the function of the plugin. For example, "Image Editor" is more suitable as the name of the plugin than "Edit Image".
  * **English Naming Convention** If your plugin name uses English, each word should be capitalized, unless it is a specific term. For example, it should be written as "Image Editor" instead of "image editor".
  * **Plugin names should follow the** [**Apple Style Guide** ](https://help.apple.com/applestyleguide/#/apsgb744e4a3?sub=apdca93e113f1d64) **specifications**
    * ✅ Suitable plugin names include:
      * `Bulk Image Downloader` This plugin name clearly indicates that its function is to download images in bulk.
      * `Duplicate Image Finder` This name clearly indicates that the function of the plugin is to find duplicate images.
      * `Image Metadata Editor V2` This name clearly indicates that the function of the plugin is to edit the metadata of images, and it is version 2.
    * ❌ Not recommended plugin names include:
      * `Extension For Pics` This name is too general and does not provide any functional information about the plugin.
      * `Adobe Image Organizer` Unless you have Adobe's authorization, proprietary names should not be used in the name.
      * `Image#Sorter` This name uses special characters #, which may cause process code errors or be difficult to understand.


* * *
Plugin Description
The plugin description should meet at least the following criteria:
  * **Clear and Concise Description** The description of the plugin should be able to explain its main function and purpose clearly in two sentences. For example, a plugin that compresses thumbnail image files may be described as "One-click compression of various mainstream format images, saving material space." An inappropriate description may be "Super, awesome tool that makes your design work better."
  * **Word Limit** To keep the description concise, we recommend that the plugin description should not exceed 100 characters. A long description may make users feel lengthy and difficult to understand.
  * **Appropriate Use of Keywords** Your plugin description should focus on functionality and purpose, and should not include other keywords unrelated to the plugin. For example, if your plugin is used to manage notes, the description should avoid words like "game" or "music" that are unrelated to the plugin.


* * *
Plugin Icon
> ℹ️ **Info:**
We have designed an Icon generator for you, which you can find [here](https://www.figma.com/community/file/1301113485954941759/eagle-plugins-icon-template-english-version).
The plugin icon should meet at least the following criteria:
  * **Use Template Design** To maintain the consistency of the style and tone of the plugin center, you should use the official template provided by us to design your plugin icon. This ensures that your plugin is consistent with the overall aesthetic style of the plugin center.
  * **Icon Padding** There should be a certain amount of padding around your plugin icon, which makes it easier to recognize in the plugin center list. For example, if your icon is a blue circle, you should leave a certain amount of blank space between the edge of the circle and the edge of the icon, rather than filling the circle with the entire icon.
  * **High Resolution** The resolution of the plugin icon published to the plugin center should be at least 256 × 256 pixels (px), and in `PNG` format.


> ℹ️ **Info:**
**Seek Help**
If you feel that designing an icon is not your strong suit, try asking for help in the [community](https://discord.gg/QUkvmAGRbX).
* * *
Plugin Cover Image
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FbECv2GqUFgAwxKkvqDvY%252Fimage.png%3Falt%3Dmedia%26token%3Da17202cc-e474-4328-bf69-47bdf7795ac2&width=768&dpr=3&quality=100&sign=6438bf5d&sv=2)
Example images of the detail page
Your cover screenshot will be displayed in the plugin center list and detail pages, and users can click and browse them to get a more detailed understanding of the functions provided by your plugin before installation. You can provide a cover image, and more details can be provided in the description. We recommend adding at least three images in the detailed description to help users understand the functions provided by your plugin and make your plugin details more beautiful.
* * *
Necessary Information for Review Staff
If your plugin requires additional configuration, such as an API token, starting a specific system configuration, or opening other third-party application processes, please provide a README file as an instruction manual and place it in the root directory of your plugin for review staff to refer to.


## Package Plugin

*Source: [https://developer.eagle.cool/plugin-api/distribution/package](https://developer.eagle.cool/plugin-api/distribution/package)*

# Package Plugin
This article will elaborate in detail on how to package plugins and publish them to the Eagle Plugin Center.
Exporting Your Plugin as an Eagle Plugin
To publish your plugin project to the Eagle Plugin Center, you first need to export the plugin in the `.eagleplugin` format.
  1. Open the plugin panel (or press the `P` key)
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FFDxBY4UIeEkjGVlvUTme%252Fimage.png%3Falt%3Dmedia%26token%3Db019a9a8-faea-4eef-aa37-cb864bb16f4f&width=768&dpr=3&quality=100&sign=10ca1e61&sv=2)
  2. Right-click on the plugin you want to publish
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252Fk7jF0IX97CnA5WjWrpRK%252Fimage.png%3Falt%3Dmedia%26token%3D78794c8e-baa0-40be-87a6-4b93dc8f3387&width=768&dpr=3&quality=100&sign=d5f16a9c&sv=2)
  3. Select "Pack Plugin"
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FEh16pOzGieBD8R6q8Fsb%252Fimage.png%3Falt%3Dmedia%26token%3D3603b608-0c89-4baf-ac3f-dfc5ca702e3b&width=768&dpr=3&quality=100&sign=60b768c4&sv=2)
  4. Choose the save path and complete the export
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FHB6y5wTRbuih9oIElCtD%252Fimage.png%3Falt%3Dmedia%26token%3Da3453309-3150-4e61-b900-c1243969b716&width=768&dpr=3&quality=100&sign=f8d440a8&sv=2)
  5. Check the Eagle Plugin file that you just exported.
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FFfLPdVRyyOtVvkyP7rBJ%252Fimage.png%3Falt%3Dmedia%26token%3D92f941ce-337d-41db-8682-66a293d3dd06&width=768&dpr=3&quality=100&sign=f0ceec10&sv=2)


Next, you need to go to the Eagle Plugin submission page, upload the `.eagleplugin` file, and fill in the necessary information. After submission, your plugin will be reviewed. Once approved, your plugin will be available on the Eagle Plugin Center.


## Publish Plugin

*Source: [https://developer.eagle.cool/plugin-api/distribution/publish](https://developer.eagle.cool/plugin-api/distribution/publish)*

# Publish Plugin
This article will detail how to package and publish plugins to the Eagle Plugin Center.
Publish your plugin to the Eagle Plugin Center
To publish your plugin project to the Eagle Plugin Center, you need to first export the plugin in `.eagleplugin` format.
Submit a new version
If you need to submit a new version, you can follow these steps:
  1. Click "Submit" from the top right corner
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FBPWbzNKRqsHTntl4ZfRO%252Fimage.png%3Falt%3Dmedia%26token%3Daee7026f-31b5-489e-a0b1-172e323eabcb&width=768&dpr=3&quality=100&sign=75ab041b&sv=2)
  2. Select "Submit Plugin"
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252F4vMDXgsn4GE0yxJOkChq%252Fimage.png%3Falt%3Dmedia%26token%3De27451fe-3bd3-417e-b4b5-d764e93220e0&width=768&dpr=3&quality=100&sign=58840c3&sv=2)
  3. Click "Upload"
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252F2bOZRFvBNkIkgfnn1eAj%252Fimage.png%3Falt%3Dmedia%26token%3D1189ca9d-e352-4d0a-bbed-2a6b33867420&width=768&dpr=3&quality=100&sign=22516f66&sv=2)
  4. Select your plugin and upload (the plugin must be a `.eagleplugin` file)
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252Fi9GA5hfcwTb6LisPChcr%252Fimage.png%3Falt%3Dmedia%26token%3D3516eb88-9099-4bcf-99f1-de1fcaa2c3ee&width=768&dpr=3&quality=100&sign=14c2ae92&sv=2)
  5. Fill in the relevant introduction information
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FP1AePe2QfduExq99cabJ%252Fimage.png%3Falt%3Dmedia%26token%3D15a9f862-5ff1-4a17-9a8e-6e87a26aa876&width=768&dpr=3&quality=100&sign=86ff8685&sv=2)
  6. Fill in the content of this version update
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252F2onTG36O3eYLvAojynYB%252Fimage.png%3Falt%3Dmedia%26token%3D19c7c321-3829-47b7-9a88-efa2683df52b&width=768&dpr=3&quality=100&sign=397f1ce3&sv=2)
  7. Submit for review and wait for the review results
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FQM1N1uefxdIoZ8yWlWmF%252Fimage.png%3Falt%3Dmedia%26token%3D236b0887-7603-4fe9-81e7-eeffb21ab9fd&width=768&dpr=3&quality=100&sign=de67cee1&sv=2)


After passing the review, your plugin can be listed on the Eagle Plugin Center.
* * *
Provide User Support
As a plugin developer, you need to provide user support. When submitting a plugin for review, you need to add a support contact. This can be an email address that users can contact, or a link to a website or help center. In this way, users can obtain technical support through the information you provide.


## Update Plugin

*Source: [https://developer.eagle.cool/plugin-api/distribution/update](https://developer.eagle.cool/plugin-api/distribution/update)*

# Update Plugin
This article will guide you to update your published plugin
Submit a new version
To submit a new version, you need to follow the above steps. First, you need to visit your personal page, click on the plugin you want to submit a new version of, select "Submit New Version", upload the new version of the `.eagleplugin` file, fill in the content of this version update, and submit for review. After the review is completed, your new version can be updated.
If you need to submit a new version, you can follow these steps:
  1. Click on the "Avatar" at the top right
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252Fgit-blob-23548e5b8109535c7b28d73ca047b26ce040ad0a%252Fimage.png%3Falt%3Dmedia&width=768&dpr=3&quality=100&sign=2fac715e&sv=2)
  2. Select "Profile"
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252Fd2XsrmBg6FGPZC71oO3A%252Fimage.png%3Falt%3Dmedia%26token%3Dded7b0e7-800a-418a-b83a-1906a670dca6&width=768&dpr=3&quality=100&sign=538b68d5&sv=2)
  3. Choose "Edit" at the top right of the plugin you want to update
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FaxO7NX0ukXL45Wo1pl3j%252Fimage.png%3Falt%3Dmedia%26token%3D39a5b852-ef3b-44f2-8344-2fa6fc230135&width=768&dpr=3&quality=100&sign=8d8e834b&sv=2)
  4. Click "Upload New Version" in the upload area
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FWKC3wHvmIzPn7pBtIpTr%252Fimage.png%3Falt%3Dmedia%26token%3Dd7e66548-3b1e-4b51-9762-bc8f93cb1358&width=768&dpr=3&quality=100&sign=19a71ecd&sv=2)
  5. Select the plugin you want to submit (the plugin must be a .eagleplugin file)
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FWQfCFj2guiQxahJPhdnR%252Fimage.png%3Falt%3Dmedia%26token%3Dd10fbdb0-bb33-42ce-8dc1-07b028a29d1f&width=768&dpr=3&quality=100&sign=e1a312c0&sv=2)
  6. Fill in the content of this version update
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252Foe6wzafzJkGTrYUYoeeR%252Fimage.png%3Falt%3Dmedia%26token%3D41ce6473-e246-4601-8766-b7565dcc050b&width=768&dpr=3&quality=100&sign=430a29cf&sv=2)
  7. Submit for review, wait for the review results, and implement the update
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FfdWOFYjMg16CMHR2MPYG%252Fimage.png%3Falt%3Dmedia%26token%3Df920af81-95ee-4f05-8d7b-d2d336459f90&width=768&dpr=3&quality=100&sign=beef8df6&sv=2)


After passing the review, your updated plugin will be displayed on the Eagle Plugin list.


## Developer Policies

*Source: [https://developer.eagle.cool/plugin-api/distribution/developer-policies](https://developer.eagle.cool/plugin-api/distribution/developer-policies)*

# Developer Policies
This article aims to help you understand our developer policies and related specifications.
> ℹ️ **Info:**
We may update our policy terms from time to time, so please refer to the policy terms at that time.
Thank you for participating in the development of Eagle plugins. Your contribution is extremely important to our community. Before you start the development process, we hope you can take some time to read and comply with the following developer policies. These policies are designed to ensure that every user's experience is of the highest quality and that all plugins meet our standards and expectations.
Thank you again for your participation and we look forward to seeing your innovative results.
Glossary
  1. Eagle: Also known as [Eagle App](https://en.eagle.cool/), a professional tool for image collection and management.
  2. Eagle plugin: Also known as "Eagle extension plugin, plugin, Eagle Plugin, Plugin", refers to the name of the process you developed based on the Eagle Plugin API.
  3. Eagle Plugin Center: The affiliated function of [Eagle Community](https://community-en.eagle.cool), where you can share the plugins you developed with others.
  4. macOS: A product trademark belonging to [Apple](https://apple.com/), an operating system developed and maintained by Apple.
  5. Windows: A product trademark belonging to [Microsoft](https://microsoft.com/), an operating system developed and maintained by Microsoft.


* * *
1. Plugin Policies
1.1 Unique Functionality and Value; Accurate Representation
Eagle plugins and related relay data must accurately and clearly describe their source and functionality.
**1.1.1 Extension plugins must have a single purpose**
Eagle plugins must have a clear and specific single-purpose function.
**1.1.2 Describe your Eagle plugin**
Eagle plugins must accurately and clearly describe the functions you have developed and any important limitations, including necessary or supported input devices. During the first run experience, your Eagle plugin must clearly indicate its own functions or limitations. Eagle plugins may not use names or icons similar or similar to existing Eagle plugins, and if you do not have permission, you may not claim to represent a company, government agency, or other entity.
**1.1.3 Functionality and Operation**
The Eagle plugin functionality you develop must operate completely normally.
**1.1.4 Search and Exploration**
Your "plugin keywords" search terms should not exceed six single words and should be related to your plugin.
**1.1.5 Stability and Performance**
Your plugin functionality should not have a negative impact on the performance or stability of Eagle or the system.
**1.1.6 Process Code Obfuscation**
Process code obfuscation is not allowed. This includes the process code in the Eagle plugin and any external process codes or resources retrieved from the network. If your process code cannot be reviewed, the Eagle Plugin Center may require you to modify the process code to a readable level.
**1.1.7 Change Eagle App or System Configuration**
Eagle plugins must not change the functionality or configuration of Eagle or the system without properly notifying and obtaining user consent. Any system configuration changes or adjustments should be clearly recorded in the Eagle plugin's description and require user consent before proceeding.
**1.1.8 License**
Your Eagle plugin can only request the license required for operation. You must provide a description of how the Eagle plugin works. Your Eagle plugin can only run as described. Your Eagle plugin may not require functionality licenses beyond what is required for declared operation and operation.
**1.1.9 Localization**
You should localize your Eagle plugin for all languages declared to be supported. The text of the Eagle plugin description should be localized in each language you declare.
If your Eagle plugin has been localized, and some features cannot be used in the localized version, you must clearly state or display the limitations of localization in the Eagle plugin description. The experience provided by the Eagle plugin must be similar in all supported languages.
**1.1.10 Plugin Presentation and Consistency**
We hope that the Eagle Plugin Center can maintain a consistent design aesthetic and user experience. Therefore, the plugin icons, screenshots, plugin names, and descriptions you provide should meet our "Examples" requirements. If your plugin does not meet our requirements in these areas, we reserve the right to not approve it. These requirements are designed to ensure the quality of the plugin and maintain the overall aesthetics and consistency of the Eagle Plugin Center.
1.2 Plugins must be testable
The submitted Eagle plugin must be testable. If for any reason your Eagle plugin cannot be tested, including but not limited to the following cases, your Eagle plugin may not meet this requirement.
**1.2.1 User Authentication**
If your Eagle plugin requires login authentication, please provide a valid demo account.
**1.2.2 Service Availability**
If your Eagle plugin requires access to a server, the server must be able to operate normally to confirm its normal operation.
1.3 Functionality Availability
**1.3.1 Cross-platform compatibility**
Eagle plugins should be compatible with all devices and platforms that Eagle can download (macOS & Windows).
If you download an Eagle plugin on an incompatible device, it should detect it at startup and prompt the user with a message explaining that the device must meet the requirements for Eagle plugin compatibility to operate.
**1.3.2 User Experience**
  * Eagle plugins must start immediately and must maintain responsiveness to user input.
  * Eagle plugins must continue to run and maintain responsiveness to user input.
  * Eagle plugins must shut down normally and not shut down unexpectedly.
  * Eagle plugins should handle exceptional situations and maintain responsiveness to user input after handling exceptional situations.


1.4 Advertising Behavior
Eagle plugins may not contain any form of advertising (including but not limited to video, animation, and text).
* * *
2. Security Policies
2.1 Information Security
Your Eagle plugin functionality must not compromise or harm the security or functionality of users' devices, systems, or related systems.
**2.1.1 Spam and Malware**
Your developed Eagle plugin must not contain or activate malicious process codes.
**2.1.2 Dependency on Other Software**
Your Eagle plugin may depend on non-integrated or other third-party software products (such as another product, module, or service) to provide primary functionality, provided that you must disclose the dependency in the description.
**2.1.3 Eagle Plugin Updates**
Unless otherwise permitted by Eagle, your Eagle plugin can only be updated through the Eagle Plugin Center.
2.2 Privacy and Personal Information
The following requirements apply to Eagle plugins that access personal information. Personal information includes all information or data that identifies or can be used to identify a person or is associated with such information or data.
**2.2.1 Collect Personal Information Only When Necessary and with User Consent**
Eagle plugins can only collect, access, use, or transmit personal information (including web activity) when users explicitly consent.
**2.2.2 Maintain Privacy Principles**
Regardless of whether your Eagle plugin accesses, collects, or transmits personal information, if required by law, you must provide important notices and comply with your privacy principles. Your privacy principles must notify users of how the Eagle plugin accesses, collects, or transmits personal information, how the information is used, stored, and protected, and the types of objects that disclose the information.
Your privacy principles must describe the use and sharing of user information, how to control access to their information, and must comply with applicable laws and regulations. When creating new features for Eagle plugins, your privacy principles must be kept up to date.
If you provide privacy principles for Eagle plugins, you agree to allow Eagle to share such privacy principles with users of Eagle plugins.
**2.2.3 Sharing Data with Collaborating Vendors**
You can only publish personal information of Eagle plugin users to external services or collaborating vendors through Eagle plugins or related relay data after obtaining the consent of these users. Consent to join means that users provide their quick permission in the Eagle plugin user interface you require activity in the following situations:
  * Describe how information is accessed, used, or shared with users and indicate the type of object disclosed.
  * Provide a mechanism in the Eagle plugin user interface for users to choose to revoke permission and exit later.


**2.2.4 Sharing Non-User Information**
If you publish personal information of individuals to external services or collaborating vendors through Eagle plugins or relay data, but the person sharing the information is not a user of the Eagle plugin:
  1. You must obtain explicit written consent to publish the personal information.
  2. You must allow the person sharing the information to revoke the consent at any time.
  3. Your privacy principles must clearly disclose that you may collect personal information in this way.
  4. If required by applicable law, you must delete any personal information of individuals, including those collected in this way.
  5. This requirement also applies if your Eagle plugin allows users to access personal information of another person.


**2.2.5 Secure Transmission of Information**
If your Eagle plugin collects, stores, or transmits personal information, it must use reasonable and secure password compilation methods to perform this action securely.
**2.2.6 Highly Sensitive Information**
Your Eagle plugin must not collect, store, or transmit highly sensitive personal information, such as health or financial information, unless such information is related to the functionality of the Eagle plugin. Your Eagle plugin must also obtain user consent before collecting, storing, or transmitting such information.
* * *
3. Financial Transactions
If your product contains in-app purchases, subscription accounts, virtual currency, billing functions, or collects financial information, the requirements in the following sections apply.
**3.1 Payment Functionality**
Your Eagle plugin allows users to access digital content or services by purchasing through third-party payment API platforms.
You must use a secure third-party payment API platform to purchase physical goods or services. For payments related to any other service, including physical gambling or charitable donations, you must also use a secure third-party payment API platform.
  * If your Eagle plugin is used to facilitate or collect charitable donations, or conduct promotional lotteries/contests, you must comply with applicable laws.
  * You must also clearly state that Eagle is not the fundraiser or sponsor of this promotion.
  * Products sold in your Eagle plugin cannot be converted into any legally valid currency (such as US dollars, euros, etc.) or any physical goods or services.


The following requirements apply when using a secure third-party payment API platform:
  * Your Eagle plugin must identify the commercial transaction provider, verify the user, and obtain the user's confirmation when collecting any payment or financial information from the user during the transaction. The commercial transaction provider maintains a secure platform for financial exchanges.
  * Eagle plugins may provide users with the ability to save this verification, but users must be able to request verification for each transaction or turn off in-app transactions.
  * If your Eagle plugin functionality collects credit card information or uses a third-party payment processor that collects credit card information, the payment processor must comply with the current PCI Data Security Standard (PCI DSS).


**3.2 Disclosure of Payment Functionality**
Your Eagle plugin and its related metadata must provide information about the type and price range of in-app purchases. You must not mislead users and must clearly state the nature of your in-app promotions and offerings, including the scope and terms of any trial experience.
* * *
4. Content Policies
The following policies apply to content and metadata (including publisher name, extension name, extension icon, extension description, extension screenshots, extension trailers and trailer thumbnails, and any other extension metadata) distributed in the "Eagle Plugin Center". Content refers to images, sounds, videos, and copy contained in your extension, blocks, notifications, error messages, or advertisements publicly available through your extension, and any content transmitted from servers or connected to your extension.
Because extensions and the "Eagle Plugin Center" are used globally, these requirements are interpreted and applied in the context of regional and cultural norms.
4.1 Content Requirements for Eagle Plugin Center Listings
Your relay data and other content included with the Eagle plugin may contain incomplete or immature content. Eagle plugin submissions that do not meet Eagle standards will be rejected or immediately removed.
4.2 Content Includes Names, Icons, Original and Third-Party
All content in your extension and its related metadata must be original to you or appropriately licensed from third-party rights holders and can only be used in accordance with the rights holders' licenses or other legal permissions.
4.3 Risk of Harm
**4.3.1 Requirements**
Your extension must not contain any content that promotes or glorifies the following real-world activities:
  * Extreme or gratuitous violence
  * Human rights violations
  * Manufacture of illegal weapons
  * Use of weapons against people, animals, or real or personal property.


**4.3.2 Responsibility**
Your Eagle plugin cannot:
  * Pose a security risk to end-users or any other person or animal, or cause them discomfort, injury, or any other harm
  * Pose or cause a risk of damage to real or personal property. You are responsible for all security testing of extensions, certificate acquisition, and implementation of any appropriate functional protection measures.


You cannot disable any platform's security or comfort features and must include all applicable legal requirements and industry-standard warnings, notices, and disclaimers in your extension.
4.4 Prohibited Content, Inappropriate Content, Activities, and Services
Eagle plugins must comply with the following conditions:
  * Eagle plugins must not contain any defamatory, libelous, slanderous, or threatening content.
  * Eagle plugins must not contain online games, sports entertainment, gambling, or other content that provides cash or other value.
  * Eagle plugins must not contain content related to cryptocurrency transactions.
  * Eagle plugins must not contain content or functionality that encourages, promotes, or glorifies illegal activities in the real world.
  * Eagle plugins must not contain profanity.
  * Eagle plugins must not contain content that promotes alcohol, tobacco, drugs, or related content.
  * Eagle plugins must not contain or display content that reasonable people would consider unreasonable.
  * Eagle plugins must not contain any content that is offensive in any country/region. Due to local laws or cultural norms, content may be considered offensive in specific countries/regions.
  * Eagle plugins must not contain any adult content (R18).


* * *
_**Eagle reserves the right to make the final review.**_
Policy last updated: _2023-11-01 11:11_


---

# 📖 Developer Guide


## manifest.json Configuration

*Source: [https://developer.eagle.cool/plugin-api/tutorial/manifest](https://developer.eagle.cool/plugin-api/tutorial/manifest)*

# manifest.json Configuration
In this article, we will provide a detailed explanation of all the supported fields in the manifest.json file for an Eagle plugin.
Each plugin must include a `manifest.json` file. This file defines the plugin's execution method and basic information such as the plugin's name, version number, and entry point for the execution code.
A complete configuration for a `manifest.json` file might look like this:
```
{
    "id": "LBCZE8V6LPCKD",
    "version": "1.0.0",
    "platform": "all",
    "arch": "all",
    "name": "Windows Plugin",
    "logo": "/logo.png",
    "keywords": [],
    "devTools": false,
    "main":
    {
        "url": "index.html",
        "width": 640,
        "height": 480,
        "minWidth": 640,
        "minHeight": 480,
        "maxWidth": 640,
        "maxHeight": 480,
        "alwaysOnTop": false,
        "frame": true,
        "fullscreenable": true,
        "maximizable": true,
        "minimizable": true,
        "resizable": true,
        "backgroundColor": "#ffffff",
        "multiple": false,
        "runAfterInstall": false
    }
}
```

Example of each field in the `manifest.json` file for a plugin:
  * `id` - Plugin ID
  * `version` - Plugin Version
  * `platform` - Support Platform
    * `all` - Support All Platforms
    * `mac` - macOS only
    * `win` - Windows OS only
  * `arch` - CPU Architectures
    * `all` - Support All Architectures
    * `arm` - only support `arm` architecture
    * `x64` - only support `x64` architecture
  * `name` - Plugin Name
  * `logo` - Plugin Logo File (only support `png`, `jpg`, `webp` format)
  * `keywords` - Plugin Keywords, In addition to the plugin name, adding "keywords" can help users quickly find the plugin when searching.
  * `devTools` - To open the developer debug window for your plugin, you need to specify this setting.
  * `main` - Plugin main entry configuration
    * `url` - Entry Page
    * `width` - Window width
    * `height` - Window height
    * `minWidth` - Window min-width
    * `minHeight` - Window min-height
    * `maxWidth` - Window max-width
    * `maxHeight` - Window max-height
    * `alwaysOnTop` - Whether the window is always on top of other windows, default value is `false`.
    * `frame` - Default value is `true`. When set to `false`, a [frameless window](https://developer.eagle.cool/plugin-api/tutorial/frameless-window) is used. This is a special window mode that does not have an outer shell (including window border, title bar, toolbar, etc.) and only contains web page content.
    * `fullscreenable` - Whether the window can enter fullscreen mode, default value is `true`.
    * `maximizable` - Whether the window can be maximized, default value is `true`.
    * `minimizable` - Whether the window can be minimized, default value is `true`.
    * `resizable` - Whether the window size can be adjusted, default value is `true`.
    * `backgroundColor` - Window background color, default value is `#FFF`.
    * `multiple` - Whether the window can be opened multiple times, default value is `false`.
    * `runAfterInstall` - Automatically opens after installation, default value is `false`.


## Retrieve Data

*Source: [https://developer.eagle.cool/plugin-api/tutorial/get-eagle-data](https://developer.eagle.cool/plugin-api/tutorial/get-eagle-data)*

# Retrieve Data
You can access various data stored in the Eagle application through methods provided by the Eagle Plugin API, such as `files`, `folders`, `libraries`, etc. Here are some simple examples:
**Example 1: Get the currently selected file in the application**
```
let selected = await eagle.item.getSelected();
console.log(selected);
```

**Example 2: Get files by specified conditions**
```
let items = await eagle.item.get({
    ids: [],
    isSelected: true,
    isUnfiled: true,
    isUntagged: true,
    keywords: [""],
    ext: "",
    tags: [],
    folders: [],
    shape: "square",
    rating: 5,
    annotation: "",
    url: ""
});
```

**Example 3: Get the currently selected folder in the application**
```
let folders = await eagle.folder.getSelected();
```

In addition to the above, the Eagle Plugin API provides many different APIs for getting information. Please click the link below to view the complete information:
  * [Library](https://developer.eagle.cool/plugin-api/api/library)
  * [Item](https://developer.eagle.cool/plugin-api/api/item)
  * [Folder](https://developer.eagle.cool/plugin-api/api/folder)
  * [App](https://developer.eagle.cool/plugin-api/api/app)
  * [Operating System](https://developer.eagle.cool/plugin-api/api/os)
  * [Notification](https://developer.eagle.cool/plugin-api/api/notification)
  * [Dialog](https://developer.eagle.cool/plugin-api/api/dialog)
  * [Clipboard](https://developer.eagle.cool/plugin-api/api/clipboard)
  * [Log](https://developer.eagle.cool/plugin-api/api/log)


## Modify Data

*Source: [https://developer.eagle.cool/plugin-api/tutorial/modify-eagle-data](https://developer.eagle.cool/plugin-api/tutorial/modify-eagle-data)*

# Modify Data
You can directly modify the results obtained using the Eagle Plugin API method. To save the modified results, just call the `save()` method of the result object. Here are some simple examples:
**Example 1: Modify the selected file of the current application**
```
// Get the currently selected file in the Eagle app
let items = await eagle.item.getSelected();
let item = items[0];

// Modify tags
item.tags = ['tag1', 'tag2'];

// Save changes
await item.save();

```

**Example 2: Modify folder properties**
```
// Get the currently selected folder in the Eagle app
let folder = (await eagle.folder.getSelected())[0];

// Modify properties
folder.name = 'New Folder Name';
folder.description = 'New description...';

// Save changes
await folder.save();
```

circle-check
**🦄 Best Practice:** To ensure data security, use the API-provided `save()` method for data access and modification, and avoid directly modifying any files under the Eagle resource library.


## Access Local Files

*Source: [https://developer.eagle.cool/plugin-api/tutorial/access-local-files](https://developer.eagle.cool/plugin-api/tutorial/access-local-files)*

# Access Local Files
We can easily use the native Node.js API to implement the functionality of accessing local files. This makes it easier for us to perform such tasks in the plugin system.
* * *
Using the `fs` module to access local files
Using a series of methods from Node.js's `fs` module, we can perform operations on the local file system to access local files. For example, you can use the `fs.readFile()` method to read the contents of a file and the `fs.writeFile()` method to write to a file. Here is an example:
```
const fs = require('fs');

// Read the file
fs.readFile('/path/to/file', (err, data) => {
  if (err) throw err;

  console.log(data);
});

// Write to the file
fs.writeFile('/path/to/file', 'hello world', (err) => {
  if (err) throw err;

  console.log('done');
});
```

These methods are asynchronous, so they won't block the UI, ensuring high performance for the application. Additionally, the `fs` module provides other useful methods, such as using `fs.stat()` to obtain file size, creation time, and other information, or using `fs.rename()` to rename a file. By using the `fs` module, we can conveniently access local files.
circle-check
**🦄 Best practice:** Avoid using synchronous methods in Node.js as much as possible, as these methods can cause UI thread blocking, leading to a user interface lag and poor user experience. Moreover, using asynchronous methods improves program execution efficiency because it does not block program execution and can handle multiple tasks simultaneously.
* * *
Use native dialogs to get file paths
Eagle Plugin API provides a `dialog` module that can be used to create native system dialogs for file saving and selection. Here are some examples:
**Example 1: Pop-up file selection dialog**
```
let result = await eagle.dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
});
```

**Example 2: Pop-up save dialog**
```
let result = await eagle.dialog.showSaveDialog({
    properties: ['openDirectory']
});
```

If you need a more detailed introduction, you can refer to the [dialog module](https://developer.eagle.cool/plugin-api/api/dialog).


## Issue Network Requests

*Source: [https://developer.eagle.cool/plugin-api/tutorial/network-request](https://developer.eagle.cool/plugin-api/tutorial/network-request)*

# Issue Network Requests
You can use the fetch method provided by web technologies or the native https module in Node.js to make network requests.
Using `fetch` to Make Network Requests
The `fetch` function is a tool for accessing network resources, allowing you to send HTTP requests and handle response processing. The `fetch` function supports many different types of requests, including `GET`, `POST`, `PUT`, and `DELETE`, and supports custom formats for request and response bodies.
By using the `fetch` function, you can easily access network resources and control the request and response process. For example, you can use the following code to send a `GET` request and process the response after the request is fulfilled:
```
fetch('https://example.com/api/endpoint')
    .then(response => response.json())
    .then(data => {
    	// Process the response here
    });
```

This example code sends a GET request to the specified network resource, then parses the response body into JSON format after the request is completed, and processes the parsed response body here.
> ℹ️ **Info:**
To learn more about the `fetch` function in Javascript, it is recommended to read the introduction on the MDN website: <https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch>[](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
This article introduces the basic usage of the `fetch` function and provides example code demonstrating how to use `fetch` to send HTTP requests and handle response processing.
In addition, you can refer to the following articles for more information about fetch:
  * "Using Fetch" (<https://davidwalsh.name/fetch>[](https://davidwalsh.name/fetch))
  * "Fetch API In Depth" (<https://css-tricks.com/using-fetch/>[](https://css-tricks.com/using-fetch/))


* * *
Using `https` to Make Requests
Due to the default security limitations of browsers, the `fetch` method sometimes encounters some restrictions. In this case, we can switch to using Node.js native networking APIs to send network requests for greater flexibility.
Sending an HTTP GET request using the `https.get` method is very simple; you only need to provide the URL of the request. For example, you can use the following code to send an HTTP GET request:
```
const https = require('https');

https.get('https://www.example.com', (res) => {
  console.log(`Got response: ${res.statusCode}`);

  res.on('data', (d) => {
    // Process response data
  });

}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
```


## Using Node.js Native API

*Source: [https://developer.eagle.cool/plugin-api/tutorial/node-js-native-api](https://developer.eagle.cool/plugin-api/tutorial/node-js-native-api)*

# Using Node.js Native API
The Eagle plugin supports the use of Node.js native APIs, allowing us to enjoy the following benefits:
  * Leverage the powerful features of Node.js for complex functions such as data processing, file compression, and network communication.
  * Utilize various modules and libraries from the existing Node.js ecosystem to quickly implement different functions in applications, avoiding reinventing the wheel.
  * Build cross-platform applications since Node.js has great support on Windows and macOS.


Example
```
const fs = require('fs');

// Read file
fs.readFile('/path/to/file.txt', (err, data) => {
    if (err) throw err;
    console.log(data);
});

// Write file
fs.writeFile('/path/to/file.txt', 'Hello, world!', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});

```

This code snippet reads a file and then writes a text to it. During the read and write operations, relevant information is displayed in the console.
In addition to the `fs` module, the Node.js native API offers many other useful modules that provide a range of common functions. Here are some popular Node.js native modules:
  1. `http` module: Provides HTTP server and client functionality.
  2. `path` module: Provides utility functions for handling file paths.
  3. `os` module: Provides features to obtain operating system information.
  4. `crypto` module: Offers encryption and decryption capabilities.
  5. `zlib` module: Delivers data compression and decompression features.


Recommended Learning Resources
Using Node.js native APIs can greatly enhance the flexibility and functionality of your applications. If you're new to Node.js, the following tutorials may be helpful:
  * MDN's Node.js beginner tutorial: <https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction>[](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction)
  * Traversy Media's "Node.js Tutorial for Beginners": <https://www.youtube.com/watch?v=TlB_eWDSMt4>[](https://www.youtube.com/watch?v=TlB_eWDSMt4)
  * freeCodeCamp's "Node.js Basics Tutorial | Learn the Basics of Node.js in 30 Minutes": <https://www.youtube.com/watch?v=w-7RQ46RgxU>[](https://www.youtube.com/watch?v=w-7RQ46RgxU)
  * The Net Ninja's "Node.js Tutorial for Beginners": <https://www.youtube.com/watch?v=w-7RQ46RgxU>[](https://www.youtube.com/watch?v=w-7RQ46RgxU)


These videos can help you get started with Node.js development and learn the basics and practical tips of Node.js.


## Using Third-Party Modules

*Source: [https://developer.eagle.cool/plugin-api/tutorial/3rd-modules](https://developer.eagle.cool/plugin-api/tutorial/3rd-modules)*

# Using Third-Party Modules
In addition to Node.js's native APIs, you can also use third-party modules in your plugin code. These third-party modules for Node.js are created and maintained by community developers, offering a var
Using the Third-Party Module is.js
Using third-party modules is similar to using native modules; you simply need to import them using the `require()` function.
Taking `is.js` as an example, it is a data type checking library for JavaScript. It provides a set of methods to determine if a variable's data type meets expectations.
First, you need to install the `is.js` module in Node.js using the following command:
```
npm install is_js --save
```

> ⚠️ **Warning:**
Note: The npm package name for is.js is is_js, with an underscore in the name.
After installation, you can use the `is.js` module in your Node.js application process. For example, you can import the `is.js` module and use its functions like this:
```
const is = require('is_js');

if (is.number(x)) {
  console.log('x is a number');
}
else {
  console.log('x is not a number');
}
```

With the `is.js` library, you can easily perform type checks on variables in JavaScript, avoiding errors caused by type mismatches.
If you want to integrate it into the Eagle plugin, here is an example code and its execution result:
```
const is = require('is_js');

eagle.onPluginCreate(() => {
    var x = 1;

    if (is.number(x)) {
        document.write('x is a number');
    } else {
        document.write('x is not a number');
    }
});
```

![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252F4opQcFHB7oNAnejI0WOQ%252Fimage.png%3Falt%3Dmedia%26token%3Da032876f-2a0c-4c8f-83c6-455e6a1686b8&width=768&dpr=3&quality=100&sign=442d2a21&sv=2)
Execution result
> ℹ️ **Info:**
The example project above can be obtained [here](https://github.com/eagle-app/eagle-plugin-examples/tree/main/3rd-party)
* * *
Third-Party Package Management Tool: NPM
npm is the official package management tool for Node.js that provides a convenient way to manage third-party modules and publish your own modules. With npm, you can quickly install modules using the `npm install` command. npm offers powerful module management features to help you better manage project dependencies and module versions, improving development efficiency.
Additionally, npm provides an online module repository where you can search and download third-party modules. Overall, npm is an indispensable tool for Node.js developers, offering a range of practical features to help you better develop and manage your projects.
> ℹ️ **Info:**
**npm Official Website -** <https://www.npmjs.com/>[](https://www.npmjs.com/)


## Multilingual (i18n)

*Source: [https://developer.eagle.cool/plugin-api/tutorial/i18n](https://developer.eagle.cool/plugin-api/tutorial/i18n)*

# Multilingual (i18n)
The Eagle plugin comes with a built-in i18next module, allowing developers to easily create multilingual plugins. i18next is a JavaScript internationalization library that makes translation and locali
The Eagle plugin has a built-in i18next module, making it easy for developers to create plugins that support multiple languages. i18next is a JavaScript library for multilingual applications, which can easily handle multilingual translations, and provides support for various translation methods, including custom translations, localization, and multi-language support.
Below we will walk you through how to make your plugin support multiple languages:
Step 1: Create the `_locales` folder
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252Fgit-blob-569807c86a1c45f8575718fb2d6ba12d5de015c9%252Fimage%2520%2819%29%2520%281%29.png%3Falt%3Dmedia&width=768&dpr=3&quality=100&sign=7ac83908&sv=2)
Step 2: Create language `.json` files
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FBUvYim43D84nY7NnPlBI%252Fimage.png%3Falt%3Dmedia%26token%3D3d752173-a1c1-45cd-b17d-e7843f1fee71&width=768&dpr=3&quality=100&sign=852313f5&sv=2)
_locales/en.json
_locales/zh_CN.json
_locales/zh_TW.json
_locales/ja_JP.json
```
{
    "manifest": {
        "app": {
            "name": "i18n example"
        }
    },
    "contextMenu": {
        "copy": "Copy",
        "paste": "Paste"
    }
}
```

```
{
    "manifest": {
        "app": {
            "name": "Multilingual example"
        }
    },
    "contextMenu": {
        "copy": "复制",
        "paste": "粘贴"
    }
}
```

```
{
    "manifest": {
        "app": {
            "name": "Multilingual example"
        }
    },
    "contextMenu": {
        "copy": "複製",
        "paste": "貼上"
    }
}
```

```
{
    "manifest": {
        "app": {
            "name": "i18n の例"
        }
    },
    "contextMenu": {
        "copy": "コピー",
        "paste": "ペース"
    }
}
```

> ℹ️ **Info:**
Currently supported languages are `en`, `ja_JP`, `es_ES`, `de_DE`, `zh_TW`, `zh_CN`, `ko_KR`, `ru_RU`.
Step 3: Adjust `manifest.json`
Using Eagle Plugin's `i18next` feature, you can define translations for multilingual applications with simple JSON files.
```
{
    "id": "LE564883T24ZR",
    "version": "1.0.0",
    
    // 1. Adjust the name
    "name": "{{manifest.app.name}}",
    "logo": "/logo.png",
    "keywords": [],
    
    // 2. Set supported languages and default language
    "fallbackLanguage": "zh_CN",
    "languages": ["en", "zh_TW", "zh_CN", "ja_JP"],
    
    "main": {
        "url": "index.html",
        "width": 640,
        "height": 480
    }
}
```

Step 4: Replace strings used in the code
Adjust plugin.js, use i18next method to get strings and perform alert
plugin.js
```
eagle.onPluginCreate((plugin) => {

    // Get multilingual fields
    let copyText = i18next.t('contextMenu.copy');
    let pasteText = i18next.t('contextMenu.paste');

    document.querySelector('#message').innerHTML = `
    <ul>
        <li>Language: ${eagle.app.locale}</li>
        <li>Copy: ${copyText}</li>
        <li>Paste: ${pasteText}</li>
    </ul>
    `;
});
```

Step 5: Switch application language and check the modification results
You can change the language settings of Eagle software by following these steps: Find and click the "Eagle" button on the screen, then select "Preferences", click "Common", and finally modify the "Language" section.
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252Fd8A9rC3ZEsX62e1XDE3v%252Fimage.png%3Falt%3Dmedia%26token%3D4637cc4a-4546-4fd9-a1d4-2c184a71fe75&width=768&dpr=3&quality=100&sign=3e2c9688&sv=2)
Switch application language
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252Fgit-blob-a32e2c55e65473ae04516b88f980c83fc620a3ba%252Fimage%2520%2820%29%2520%281%29.png%3Falt%3Dmedia&width=768&dpr=3&quality=100&sign=31634b10&sv=2)
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252Fgit-blob-cb19a0370eaf4f0da654e55033aeda93aa49c713%252Fimage%2520%2816%29.png%3Falt%3Dmedia&width=768&dpr=3&quality=100&sign=9a1eb604&sv=2)
> ℹ️ **Info:**
**Complete Example Code:**
<https://github.com/eagle-app/eagle-plugin-examples/tree/main/i18n>[](https://github.com/eagle-app/eagle-plugin-examples/tree/main/i18n)
Learn Advanced Usage
i18next has many convenient methods that allow us to easily cope with various translation scenarios. To ensure brevity, only the core usage methods are explained here. If you need to learn more about i18next usage and advanced techniques, it's recommended to read the following links:
  * i18next Official Documentation: <https://www.i18next.com/overview/getting-started>[](https://www.i18next.com/overview/getting-started)
  * i18next GitHub Repository: <https://github.com/i18next/i18next>[](https://github.com/i18next/i18next)


By reading the official documentation, you can understand the basic concepts and usage of i18next and find some example code to help you get started using it. The GitHub repository contains the source code and more documentation of i18next. If you want to further understand its implementation details, you can check it out there.


## Frameless Window

*Source: [https://developer.eagle.cool/plugin-api/tutorial/frameless-window](https://developer.eagle.cool/plugin-api/tutorial/frameless-window)*

# Frameless Window
Open a window without toolbars, borders, and other graphical shells.
A borderless window is a special type of window mode that does not have a shell (including window borders, title bars, toolbars, etc.), containing only the web content. Using a borderless window mode allows you to fully customize the window interface, making your application look consistent across all operating systems. However, since borderless windows do not have a system-provided shell, care must be taken while using them to avoid affecting the user experience.
Create a Borderless Window​
In the `manifest.json` file, set the `frame` property of the `window` object to `false` to enable borderless window mode.
```
{
    "id": "LB5UL2P0Q9FFF",
    "version": "1.0.0",
    "name": "Hello World",
    "logo": "/logo.png",
    "keywords": ["keywrod1", "keywrod2"],
    "main":
    {
        "frame": false,        // 👈 Borderless mode
        "url": "index.html",
        "width": 640,
        "height": 480
    }
}
```

Draggable Area
You can use the `-webkit-app-region` property in your application to control the draggable area of the application window.
By default, borderless windows are non-draggable. The application needs to specify `-webkit-app-region: drag` in CSS to tell the plugin which areas are draggable (like standard title bars of the operating system). Use `-webkit-app-region: no-drag` within the draggable area to exclude some parts. Please note that currently only rectangular shapes are supported.
To make the entire window draggable, you can add `-webkit-app-region: drag` as the `body` style:
```
<body style="-webkit-app-region: drag">
</body>
```

Please note that if you make the entire window draggable, you must mark the buttons inside as not draggable, otherwise users will not be able to click on them:
```
button {
  -webkit-app-region: no-drag;
}
```

If you only set the custom title bar to be draggable, you also need to make all the buttons within the title bar non-draggable.


---

# 🔧 API Reference


## API: event

*Source: [https://developer.eagle.cool/plugin-api/api/event](https://developer.eagle.cool/plugin-api/api/event)*

# event
You can define some callback functions in advance according to your needs, and Eagle will actively call them when events occur.
onPluginCreate(callback)
When the plugin window is created, Eagle will actively call this method. You can use this method to initialize the modules required by the plugin.
  * `callback` Function
    * `plugin` Object - Plugin attributes
      * `manifest` Object - The complete configuration of the plugin's manifest.json.
      * `path` String - The path where the plugin is located


```
eagle.onPluginCreate((plugin) => {
    console.log(plugin.manifest.name);
    console.log(plugin.manifest.version);
    console.log(plugin.manifest.logo);
    console.log(plugin.path);
});
```

> ℹ️ **Info:**
Tip: If the plugin can run without manifest information, you can also use `window.onload` for development.
onPluginRun(callback)
When the user clicks on the plugin in the plugin panel, Eagle will actively call this method.
  * `callback` Function


```
eagle.onPluginRun(() => {
    console.log('eagle.onPluginRun');
});
```

onPluginBeforeExit(callback)
Before the plugin window closes, Eagle will actively call this method.
  * `callback` Function


```
eagle.onPluginBeforeExit(() => {
    console.log("Plugin will exit");
});

// Prevent window from closing
window.onbeforeunload = (event) => {
    return event.returnValue = false;
};
```

> ℹ️ **Info:**
Tip: If you want to prevent the window from being closed, you can register the `window.onbeforeunload` method to avoid the window being closed.
onPluginShow(callback)
When the plugin window is displayed, Eagle will actively call this method.
  * `callback` Function


```
eagle.onPluginShow(() => {
    console.log("Plugin window displayed");
});
```

onPluginHide(callback)
When the plugin window is hidden, Eagle will actively call this method.
  * `callback` Function


```
eagle.onPluginHide(() => {
    console.log("Plugin window hidden");
});
```

onLibraryChanged(callback)
When the user switches the resource library, Eagle will actively call this method.
  * `callback` Function
    * `libraryPath` String - The current resource library path.


```
eagle.onLibraryChanged((libraryPath) => {
    console.log(`Resource library switch detected, new resource library path: ${libraryPath}`);
});
```

> ℹ️ **Info:**
Tip: If you need to get more complete information about the resource library, you can use the `eagle.library.info()` method to obtain it.
> ⚠️ **Warning:**
**Note:** If the plugin execution process must rely on a relative resource library path, you may need to register this method and make corresponding adjustments when the resource library changes to avoid errors during program execution.
onThemeChanged(callback)
When the main program theme color of Eagle changes, Eagle will actively call this method. If the plugin supports multiple color themes, you can use this method to make corresponding UI adjustments.
  * `callback` Function
    * `theme` String - The name of the current theme color, such as `Auto`, `LIGHT`, `LIGHTGRAY`, `GRAY`, `DARK`, `BLUE`, `PURPLE`.


```
eagle.onThemeChanged((theme) => {
    console.log(`Color theme has changed to: ${theme}`);
});
```


## API: item

*Source: [https://developer.eagle.cool/plugin-api/api/item](https://developer.eagle.cool/plugin-api/api/item)*

# item
The eagle.item API allows you to easily query the current content of the resource library or add new content to the resource library.
```
eagle.onPluginCreate(async (plugin) => {
    // Get the currently selected file in the Eagle app
    let items = await eagle.item.getSelected();
    let item = items[0];
    
    // Modify attributes
    item.name = 'New Name';
    item.tags = ['tag1', 'tag2'];
    
    // Save modifications
    await item.save();
});
```

circle-check
**🦄 Best Practice:** To ensure data security, use the `item` API provided `save()` method for data access and modification, and avoid directly modifying the `metadata.json` or any files under the Eagle resource library.
* * *
Methods
get(options)
Universal search method that can get files with specified conditions.
  * `options` Object - Query conditions
    * `id` string (optional) - File id
    * `ids` string[] (optional) - Array of file ids
    * `isSelected` boolean (optional) - Currently selected files
    * `isUntagged` boolean (optional) - Files that have not been tagged
    * `isUnfiled` boolean (optional) - Files that have not been categorized
    * `keywords` string[] (optional) - Contains keywords
    * `tags` string[] (optional) - Contains tags
    * `folders` string[] (optional) - Contains folders
    * `ext` string (optional) - Format
    * `annotation` string (optional) - Annotation
    * `rating` Integer (optional) - Rating, range from `0 ~ 5`
    * `url` string (optional) - Source URL
    * `shape` string (optional) - Shape, options are `square`, `portrait`, `panoramic-portrait`, `landscape`, `panoramic-landscape`
    * `fields` string[] (optional) - Specify fields to return, only returning needed data to improve performance
  * Returns `Promise<items: Item[]>` - `items` query result


```
let items = await eagle.item.get({
    ids: [],
    isSelected: true,
    isUnfiled: true,
    isUntagged: true,
    keywords: [""],
    ext: "",
    tags: [],
    folders: [],
    shape: "square",
    rating: 5,
    annotation: "",
    url: ""
});


let selected = await eagle.item.get({
    isSelected: true
});

let jpgs = await eagle.item.get({
    ext: "jpg"
});

// Get only specific fields to improve performance
let itemsWithFields = await eagle.item.get({
    tags: ["Design"],
    fields: ["id", "name", "tags", "modifiedAt"]
});
```

> ℹ️ **Info:**
**Performance Tip:** Using the `fields` parameter can significantly improve performance, especially when handling large numbers of files and only partial information is needed.
* * *
getAll()
Return all files.
  * Returns `Promise<items: Item[]>` - `items` all files


```
let items = await eagle.item.getAll();
console.log(items);
```

circle-check
**🦄 Best Practice:** If the resource library has a large number of files (e.g., 20W+), avoid calling this method without restrictions to avoid reducing application performance.
* * *
getById(itemId)
Return the file with the specified ID.
  * `itemId` string
  * Returns `Promise<item: Item>` - `item` the file with the corresponding ID


```
let item = await eagle.item.getById('item_id');
console.log(item);
```

getByIds(itemIds)
Return the files with the specified IDs.
  * `itemIds` string[]
  * Returns `Promise<items: Item[]>` - `items` the files with the corresponding IDs


```
let items = await eagle.item.getByIds(['item_id_1', 'item_id_2']);
console.log(items);
```

* * *
getSelected()
Return the currently selected files in the application.
  * Returns `Promise<items: Item[]>` - `items` selected files


```
let selected = await eagle.item.getSelected();
console.log(selected);
```

* * *
getIdsWithModifiedAt()
Quickly get IDs and last modified times for all files.
  * Returns `Promise<items: Object[]>` - Array of objects containing `id` and `modifiedAt`


```
// Get all file IDs and modification times for incremental sync
let fileInfo = await eagle.item.getIdsWithModifiedAt();
console.log(fileInfo);
// Output: [{ id: "item_id_1", modifiedAt: 1234567890 }, ...]

// Example: Incremental sync use case
let lastSyncTime = getLastSyncTimestamp();
let allFiles = await eagle.item.getIdsWithModifiedAt();
let modifiedFiles = allFiles.filter(file => file.modifiedAt > lastSyncTime);

// Only fetch full data for files that have been modified
if (modifiedFiles.length > 0) {
    let modifiedIds = modifiedFiles.map(file => file.id);
    let fullData = await eagle.item.getByIds(modifiedIds);
    // Process modified files...
}
```

> ℹ️ **Info:**
**Performance Tip:** This method is specifically optimized for retrieving file IDs and modification times, and is much faster than using the `get()` method to retrieve complete data.
* * *
count(options)
Returns the number of files that match the specified query conditions.
  * `options` Object - Query conditions (same as `get()` method)
    * `id` string (optional) - File id
    * `ids` string[] (optional) - Array of file ids
    * `isSelected` boolean (optional) - Currently selected files
    * `isUntagged` boolean (optional) - Files that have not been tagged
    * `isUnfiled` boolean (optional) - Files that have not been categorized
    * `keywords` string[] (optional) - Contains keywords
    * `tags` string[] (optional) - Contains tags
    * `folders` string[] (optional) - Contains folders
    * `ext` string (optional) - Format
    * `annotation` string (optional) - Annotation
    * `rating` Integer (optional) - Rating, range from `0 ~ 5`
    * `url` string (optional) - Source URL
    * `shape` string (optional) - Shape, options are `square`, `portrait`, `panoramic-portrait`, `landscape`, `panoramic-landscape`
  * Returns `Promise<count: number>` - `count` number of files matching the query conditions


```
// Count all selected files
let selectedCount = await eagle.item.count({
    isSelected: true
});

// Count JPG files
let jpgCount = await eagle.item.count({
    ext: "jpg"
});

// Count files with specific tags
let taggedCount = await eagle.item.count({
    tags: ["design", "inspiration"]
});

console.log(`Selected: ${selectedCount}, JPG: ${jpgCount}, Tagged: ${taggedCount}`);
```

> ℹ️ **Info:**
**Performance Tip:** The `count()` method is optimized for performance and is more efficient than calling `get()` and checking the array length when you only need the number of files.
* * *
countAll()
Returns the total number of files in the resource library.
  * Returns `Promise<count: number>` - `count` total number of files


```
let totalCount = await eagle.item.countAll();
console.log(`Total files in library: ${totalCount}`);
```

> ℹ️ **Info:**
**Performance Tip:** This method is highly optimized and provides a fast way to get the total file count without loading all file data into memory.
* * *
countSelected()
Returns the number of currently selected files in the application.
  * Returns `Promise<count: number>` - `count` number of selected files


```
let selectedCount = await eagle.item.countSelected();
console.log(`Currently selected files: ${selectedCount}`);

// Equivalent to:
// let selectedCount = await eagle.item.count({ isSelected: true });
```

> ℹ️ **Info:**
**Performance Tip:** This is a convenience method that provides a faster way to count selected files compared to using `getSelected().length`.
* * *
select(itemIds)
Select specified files
  * `itemIds` string[] - Array of file IDs to select
  * Returns `Promise<result: boolean>` - `result` whether the selection was successful


```
// Select a single file
await eagle.item.select(['ITEM_ID_1']);

// Select multiple files
await eagle.item.select(['ITEM_ID_1', 'ITEM_ID_2', 'ITEM_ID_3']);

// Clear selection
await eagle.item.select([]);
```

> ℹ️ **Info:**
Note: Calling this method will replace the current selection state, rather than appending to existing selected items.
> ℹ️ **Info:**
Note: The `select()` method requires Eagle 4.0 build12 or higher.
* * *
addFromURL(url, options)
Add an image link to Eagle.
  * `url`string - The image link to add, supports `http`, `https`, `base64`
  * `options` Object
    * `name` string (optional) - File name
    * `website` string (optional) - Source URL
    * `tags` string[] (optional) - Tags
    * `folders` string[] (optional) - Belonging folder IDs
    * `annotation` string (optional) - Annotation
  * Returns `Promise<itemId: string>` - `itemId` is the successfully created item ID


```
const imgURL = 'https://cdn.dribbble.com/userupload/3885520/file/original-ee68b80a6e10edab6f192e1e542da6ed.jpg';
const itemId = await eagle.item.addFromURL(imgURL, { 
    name: 'Camping', 
    website: 'https://dribbble.com/shots/19744134-Camping-2', 
    tags: ["Dribbble", "Illustration"],
    folders: [],
    annotation: 'add from eagle api',
});
```

* * *
addFromBase64(base64, options)
Add a base64 image to Eagle.
  * `base64`string - Base64 format image
  * `options` Object
    * `name` string (optional) - File name
    * `website` string (optional) - Source URL
    * `tags` string[] (optional) - Tags
    * `folders` string[] (optional) - Belonging folder IDs
    * `annotation` string (optional) - Annotation
  * Returns `Promise<itemId: string>` - `itemId` is the successfully created item ID


```
const base64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgMjM0IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyNDAgMjM0Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzI2MTMwMCIgZD0iTTEwIDEwaDIyMHYyMTMuOTk5aC0yMjB6Ii8+PHBhdGggZD0iTTAgMHYyMzRoMjQwLjAwMXYtMjM0aC0yNDAuMDAxem0xMCAxMGgyMjAuMDAxdjIxNGgtMjIwLjAwMXYtMjE0em03My4yNTIgMTIyLjUwMWwtNy45MiAyOS45ODJjLS4xNjUuODI0LS40OTUgMS4wMTgtMS40ODUgMS4wMThoLTE0LjY4N2MtLjk4OCAwLTEuMTUyLS4zMy0uOTg4LTEuNDg1bDI4LjM4LTk5LjQ0OGMuNDk1LTEuODE1LjgyNS0zLjM3Ny45OS04LjMyOCAwLS42Ni4zMy0uOTkuODI1LS45OWgyMC45NTVjLjY2IDAgLjk5LjE2NSAxLjE1NS45OWwzMS44NDUgMTA3Ljk0Yy4xNjUuODI0IDAgMS4zMi0uODI1IDEuMzJoLTE2LjVjLS44MjQgMC0xLjMxOS0uMTkzLTEuNDg0LS44NTRsLTguMjUtMzAuMTQ2aC0zMi4wMTF6bTI3Ljg4NS0xNi4yNWMtMi44MDUtMTEuMDU2LTkuNDA1LTM1LjI4Ni0xMS44OC00N2gtLjE2NWMtMi4xNDYgMTEuNzE1LTcuNDI1IDMxLjQ5LTExLjU1IDQ3aDIzLjU5NXptNDQuOTkzLTU1LjU3OGMwLTYuNDM1IDQuNDU1LTEwLjIzIDEwLjIzLTEwLjIzIDYuMTA1IDAgMTAuMjMgNC4xMjUgMTAuMjMgMTAuMjMgMCA2LjYtNC4yOSAxMC4yMy0xMC4zOTUgMTAuMjMtNS45NCAwLTEwLjA2NS0zLjYzLTEwLjA2NS0xMC4yM3ptMS4xMiAyMi43MzJjMC0uODI1LjMzLTEuMTU1IDEuMTU1LTEuMTU1aDE1LjY4OWMuODI1IDAgMS4xNTUuMzMgMS4xNTUgMS4xNTV2NzguOTM5YzAgLjgyNi0uMTY1IDEuMTU2LTEuMTU1IDEuMTU2aC0xNS41MjRjLS45OSAwLTEuMzItLjQ5Ni0xLjMyLTEuMzJ2LTc4Ljc3NXoiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBmaWxsPSIjRkY3QzAwIi8+PC9zdmc+';
const itemId = await eagle.item.addFromBase64(base64, { 
    name: 'Illustation Logo', 
    website: 'https://www.eagle.cool/', 
    tags: ["Adobe", "Logo"],
    folders: [],
    annotation: 'ai logo form api',
});
```

* * *
addFromPath(path, options)
Add files to Eagle from a local file path.
  * `path`string - The file path to add
  * `options` Object
    * `name` string (optional) - File name
    * `website` string (optional) - Source URL
    * `tags` string[] (optional) - Tags
    * `folders` string[] (optional) - Belonging folder IDs
    * `annotation` string (optional) - Annotation
  * Returns `Promise<itemId: string>` - `itemId` is the successfully created item ID


```
const filePath = 'C:\\Users\\User\\Downloads\\ai.svg';
const itemId = await eagle.item.addFromPath(filePath, { 
    name: 'Illustation Logo', 
    website: 'https://www.eagle.cool/', 
    tags: ["Adobe", "Logo"],
    folders: [],
    annotation: 'ai logo form api',
});
```

* * *
addBookmark(url, options)
Add a bookmark link to Eagle.
  * `url`string - The bookmark link to add
  * `options` Object
    * `name` string (optional) - Bookmark name
    * `base64` string (optional) - Custom thumbnail in base64 format
    * `tags` string[] (optional) - Tags
    * `folders` string[] (optional) - Belonging folder IDs
    * `annotation` string (optional) - Annotation
  * Returns `Promise<itemId: string>` - `itemId` is the successfully created item ID


```
const bookmarkURL = 'https://www.google.com/';
const itemId = await eagle.item.addBookmark(bookmarkURL, { 
    name: 'Eagle', 
    tags: ["Eagle", "Site"],
    folders: [],
    annotation: 'bookmark form api',
});
```

```
const bookmarkURL = 'https://www.google.com/';
const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAnCAYAAACIVoEIAAAAAXNSR0IArs4c6QAACUFJREFUWAmlWFlzVMcV/u42Gi0w2pEE1miFIIGRkMoowRCbRErKlUqeU5Uqv+UhD6n4yW8pJ1V5i/9AquynuPLisCUEHNtsdkJYBAGMkWWJAhGMomAWIzSjmbvkO31vX90ZCSMlPdW3u8/e55w+t+8A/2cLAHNZf+MNU4tdhluJPoQZmieeaMBaxt/OuD++b1k/c/MuEElKV9nG/KXLF998e+C137zpvpWzrO7AJb680Vo/gnEKJ2X76zzvd68/Z79jd/ziRG3RMUaNIKiIqcoFlK0LnofNm9Y7M/ng1/dtbDICG4ZItoDqB3kceusPzQ9/Or1QaVqv5opir10mAQiEnk0GmYu7m4oBqfGOXTC8n5t25leBu6iECuGzmhlYaO7dhEeGDT/nwoi8VJm2cX3/u5i363utlrbX53M+DD/yh9BEhmj5asmHjAEN56hcagcwGwKvAGVURC1ET4ur5wVo3VCDup4GzC+60Mlj2BaKMzdx7vQ4XvzJqwiq0wiKrlKoZCWFci5L3ZTXCPAjILdKRkZOuzMm1JOy0WSctgxnsWAyJJ6PgBqFt5rw8388gNquPnQM9WGh4C1tTO8wUprUpUDyYPd9X1GaQRBQ3Op+ruuho6sR6U1NcF0aJLL4sBwbjy6PY+KzOxj5wSjydopwyiROaMQD0mWtxtCGEC/waO3TFk7B8DFUGiqQsqbwhInZ6QoLXTs78IQb4sFQlAETKlXI4fSBP6Fr126GtR0LDJuSLo+QLKRVz8SDuBgt8yj9TPos3JXi1x4LiUMGgTEDiz56+9oQ1K9HIGETej6clIU7p47j3jwwOLYXC54StOQV0iiPrTCKDSU4rqXZgpBkFXcvteRcxRp1tWm0bhcv8ERF6MA0YXx5D+eOncDzYz+C09SAxad4aUl2OIs1cCJzKQmuH4WPIEP7MCYkUdLzAb25eTCLxTRPFPMqRBpIOyYm/3IYyLSh91tDyBWZ3JESFT7KEZl6zmnckrpiby2FTxj5izEidWnt0YjWtgzWd7eiQKXSlFNZAgo3JnHl3FUMvTIGr6qKOSF8oSFJcXGikzeeh2pCes2jpKvw+cp1hC9vBFqmge6dncgZLNeSf0LFrVcEHsYPH0Tj1kG0bNuCXLIEkEToYg9FE7UZ4U8o01PBicHSVO3TngqPceglmUsJyHY3w2ltLCkBpuPg4aWzmL4xh/7du1CwHCqSA7PcS6JHwQWn+wowMUhopZm+t5RTChJhxKiqSgfPDdBLYdSUUJ8lwMnN48rR93gSs7h55iQst8jXpqRmwN1GIaScZadLFOtOZcoQvRb6KNFDTylBkTARTQKPxbGrfxP8zDr4UgIiZoeF8s7Jv+KhW4F9P/wObk7ewv3xM7BsvrtiBWKeyAmNLDE0CQupljYSJzotpqywk0HmHo2oq6tC09Z25FkCpCmFJvNq7i6unPwYW1/eh5bBPnR9cy8uHTkK68nj0FsUsJKHxLCkcUqe3oTIZ49skhwXLwhWVLPJyPzoHuxEPlWhfKwFpCwTnx89xHrUiezQAB7mfWzZM4IFowYzJ45BvKhpVzuWh1BMMHmM1dkQw6RLcrdsrEd1thVFlgBlIx8Gw5Of+gSfX53E9u+NophK813OupTJoP+7o7h6+gy82TsI6E0xqESZ3qseiS83WugZINWWckoYiLDpjexgF3LRpUQpYBI7vE1cP3IITduGUd/bw5oltwuwgnvYOPg80q09mDxyEI5lxAYpwyK5JUYIjL3EcAL8oOSWEHKKl9p7W2A1N6hE14LkFvBw/GN8MfsYm/fuQV4MphCFp2SXYd42NoqpT2/gycRVetWJPSGKtfLkqOYrGEwQpcurWTEGqK5O8f3WhbxLAJso9Q0T1vwjTHz4AczGrNylmYV8j0sJYHmQUSp9XU83NuzYhWt/Zs65BcUXqDIhpSKkS44Kx8wR/rCLGSpwrFOinD8pAR3bsnBrangLkPwKjXL4Orl76ii+LPAiaKUwfewQ7EdzcIp52IU8nKj7XEsh/c/9POb+fhwVflHh7UXSSSddPI9glsCiLnKC/ILKbzkuhpSA+sYa1G5u50tV/BAaZPAWgAdzmL54GVZDrzJ0+pMJfHHhNaSqqtVmxKNx46vIr/8Gzu8/gKrD7ypPxrhnTAw5ICzC0iQW6sKWHejGIj3BIkVlhNFmdSKrMmgceBF3Z2bRv2sHgt1D8B/wlNEz8ReDEiUPfrc0tiNYJM1Xc1yG4YjRXzORO76Rz+PC8bfp0WLBaO+VK24rCyWPuHKg5g5QMB1kR0YwO/V7GAtzaNz3Ci98O2I6Rc5HzCZx52oN9qgImPRH9WIRF37Jc1KVdrBxRy9ycsWVgIQyJdFU8+k5u7YencPD+PT9/RjZuhNeppknoHQDyc3EBuq9yaiBWr7AIh0KHTgo5PKKyty+dzuM+hoWQj88ukJLYqHXyS61qGVgEBZP38z7THTWsiRe0+lRH31FE+nWuBI+4oRW00e1E2amrcmIKkBsRCyADEoIudxUJXpfHsWta58hf+MaL1pMR42PhCf5tKIkbMV5tHlFH364Gia/tQheaoqRy1ihKGYvsoJnuntQt3UoLAvyvSgBj/Ayxjzk51Ktn2acwGOc0MtaX110aSc8bkIgUmOFguG6wD8LOve8hHv3HvOS9zeYfB/GgoVeyGQs69qA5FhOo3hFD5t8RKzYFFGZcLmvV2xoxcYXvo2pD4/BePIVDWF+JehKjEzAkzTlc83Dmi3NMFm99bn4euOIFZ4COTe+MMIr8DrMfsR7lMOCKcoFLyO79ohel4wJuhJ4JIPo8DUjk2c1LUBuoUZNBtm9Y7h57izc2dvxdUXTxCOFKmOTY6Rc4Enj1Tx0EEtcdF14llFJfJFhbOzfjgpeV25/cBA2v3iUt0Sh7gmlGqeN0KMYpnqCR/Tww4F/5/CWa/Kx6s5KGVSk0bnv+/j3jRksTP4T8oUTChJh7HwPGolevtY4gQu9vAECFmQ2w75z/pTdMLiHO5TUErtX1+S6ka60kM724dbJ99BT20AZq+cv1xKwID+YuMid8YX8+F/T/3DT68ZM23H+F6EBt7jgWpi7flm+XMt1rWFt+LlbUx+RwRX3VFZsGW63U04K4c1hDYJYVAsF0qd4+VsTWykx/cO/Ib35a2dvE/H4v9IJhWmtCpMiAAAAAElFTkSuQmCC';
const itemId = await eagle.item.addBookmark(bookmarkURL, { 
    name: 'Eagle', 
    base64: base64,
    tags: ["Eagle", "Site"],
    folders: [],
    annotation: 'bookmark form api',
});
```

* * *
open(itemId, options)
Display the file corresponding to `itemId` in the full list
  * `itemId` string - ID of the file to display
  * `options` Object (optional) - Open options
    * `window` boolean (optional) - Whether to open the file in a new window, defaults to `false`
  * Returns `Promise<result: boolean>`


```
// Open in current window
await eagle.item.open("item_id");

// Open in new window
await eagle.item.open("item_id", { window: true });
```

> ℹ️ **Info:**
Note: The `window` parameter requires Eagle 4.0 build12 or higher.
> ℹ️ **Info:**
Hint: You can also directly call the `open()` method of the item instance to open the file.
* * *
Class: Item
Object type returned by Eagle API `get`, provides modification and save features.
circle-check
**🦄 Best Practice:** To ensure data security, use `save()` method provided by the Item instance for data access and modification. Avoid directly modifying `metadata.json` or any files in the Eagle repository.
* * *
#### 
Instance methods
**save()**
Save all modifications
  * Returns `Promise<result: boolean>` - `result` indicates whether the modification was successful


```
let item = await eagle.item.getById('item_id');
item.name = 'New Name';
item.tags = ['tag_1', 'tag_2'];

// Save changes
await item.save();
```

* * *
**moveToTrash()**
Move the file to the trash.
  * Returns `Promise<result: boolean>` - `result` Indicates whether the deletion was successful.


```
await item.moveToTrash();
```

* * *
**replaceFile(filePath)**
Replace the original file with the specified file, automatically refreshing the thumbnail without needing to call `refreshThumbnail()` again.
circle-check
**🦄 Best Practice:** Directly modifying the file you want to change can be risky. Errors or exceptions during the process may cause file corruption and be irreversible. Therefore, to ensure a more robust operation, first save the new version of the file in another location on your computer. After verifying it's correct, use the `replaceFile()` method to replace it.
  * `filePath` string - Path of the file to replace
  * Returns `Promise<result: boolean>` - `result` indicates whether the replacement was successful


```
let item = await eagle.item.getById('item_id');
let result = await item.replaceFile('new_file_path');

console.log(result);
```

* * *
**refreshThumbnail()**
Refreshes the file thumbnail, and updates the properties like file size, color analysis, dimensions, etc.
  * Returns `Promise<result: boolean>` - `result` indicates whether the operation was successful


```
let item = await eagle.item.getById('item_id');
let result = await item.refreshThumbnail();

console.log(result);
```

* * *
**setCustomThumbnail(thumbnailPath)**
Set a custom thumbnail for the file.
  * `thumbnailPath` string - Path of the thumbnail to set
  * Returns `Promise<result: boolean>` - `result` indicates whether the replacement was successful


```
let item = await eagle.item.getById('item_id');
let result = await item.setCustomThumbnail('thumbnail_path');

console.log(result);
```

* * *
**open(options)**
Display this file in the full list
  * `options` Object (optional) - Open options
    * `window` boolean (optional) - Whether to open the file in a new window, defaults to `false`
  * Returns `Promise<void>`


> ℹ️ **Info:**
Hint: You can also directly call the `eagle.item.open(itemId, options)` method to open the file.
```
let item = await eagle.item.getById('item_id');
// Open in current window
await item.open();

// Open in new window
await item.open({ window: true });

// Equivalent to
await eagle.item.open('item_id');
await eagle.item.open('item_id', { window: true });
```

> ℹ️ **Info:**
Note: The `window` parameter requires Eagle 4.0 build12 or higher.
* * *
**select()**
Select this file
  * Returns `Promise<result: boolean>` - `result` whether the selection was successful


```
let item = await eagle.item.getById('item_id');
await item.select();

// Equivalent to
await eagle.item.select([item.id]);
```

> ℹ️ **Info:**
Note: Calling the instance method `select()` will clear the current selection and select only this file. To batch select multiple files, use the static method `eagle.item.select(itemIds)`.
> ℹ️ **Info:**
Note: The `select()` method requires Eagle 4.0 build12 or higher.
* * *
#### 
Instance properties
`**id**`**string**
Read-only, file ID.
`**name**`**string**
File name.
`**ext**`**string**
Read-only, file extension.
`**width**`**Interger**
Image width.
`**height**`**Interger**
Image height.
`**url**`**string**
Source link.
`**isDeleted**`**boolean**
Read-only, is the file in the trash.
`**annotation**`**string**
File annotation.
`**tags**`**string[]**
File tags.
`**folders**`**string[]**
Belonging folder ids.
`**palettes**`**Object[]**
Read-only, color palette information.
`**size**`**Interger**
Read-only, file size.
`**star**`**Interger**
Rating information, `0 ~ 5`.
`**importedAt**`**Interger**
Import time (timestamp). Readable and writable, call `save()` after modification.
```
// Read import time
let date = new Date(item.importedAt);

// Modify import time (requires Eagle 4.0 build18+)
item.importedAt = Date.now();
item.importedAt = new Date('2024-01-01').getTime();
await item.save();
```

> ℹ️ **Info:**
Note: Value must be a positive integer timestamp, invalid values will be ignored. This feature requires Eagle 4.0 build18 or later.
`**modifiedAt**`**Interger**
Read-only, last modified time.
```
let modifiedDate = new Date(item.modifiedAt);
console.log(`File was last modified: ${modifiedDate.toLocaleString()}`);
```

`**noThumbnail**`**boolean**
Read-only, the file doesn't have a thumbnail. Files without a thumbnail will be previewed using the original file.
`**noPreview**`**boolean**
Read-only, the file is not supported for double-click preview.
`**filePath**`**string**
Read-only, returns the file path.
`**fileURL**`**string**
Read-only, returns the file URL (`file:///`).
`**thumbnailPath**`**string**
Read-only, returns the thumbnail path.
`**thumbnailURL**`**string**
Read-only, returns the thumbnail URL (`file:///`). Use this property if you want to display the file in HTML.
`**metadataFilePath**`**string**
Read-only, location of the `metadata.json` file for this file.
circle-check
**🦄 Best Practice:** To ensure data security, use the `item` API provided `save()` method for data access and modifications. Avoid directly modifying `metadata.json`.


## API: folder

*Source: [https://developer.eagle.cool/plugin-api/api/folder](https://developer.eagle.cool/plugin-api/api/folder)*

# folder
The eagle.folder API allows you to easily create new folders or access existing ones in the current application.
```
// Get the currently selected folder in the Eagle application
let folder = (await eagle.folder.getSelected())[0];

// Modify properties
folder.name = 'New Folder Name';
folder.description = 'New description...';

// Save changes
await folder.save();
```

circle-check
**🦄 Best Practice:** To ensure data safety, please use the `save()` method provided by the API for data access and modification. Avoid directly modifying the `metadata.json` or any files under the Eagle resource library.
Methods
create(options)
Create a folder.
  * `options` Object
    * `name` string - Folder name
    * `description` string (optional) - Folder description
    * `parent` string (optional) - Parent folder ID; with this parameter, it is equivalent to `createSubfolder(parentId, options)`
  * Returns `Promise<folder: Folder>` - Successfully created `folder`


```
let newFolder = await eagle.folder.create({
    name: 'New Folder',
    description: 'Folder\'s description.',
});
```

* * *
createSubfolder(parentId, options)
Create a subfolder.
  * `parentId` string - Parent folder ID
  * `options` Object
    * `name` string - Folder name
    * `description` string (optional) - Folder description
  * Returns `Promise<folder: Folder>` - Successfully created `folder`


```
let parentFolder = await eagle.folder.getById('folder_id');
let subFolder = await eagle.folder.createSubfolder(parentFolder.id, {
    name: 'Subfolder',
    description: 'Subfolder description.',
});
```

* * *
get(options)
Get folders with specified conditions.
  * `options` Object - Query conditions
    * `id` string (optional) - Folder id
    * `ids` string[] (optional) - Array of folder ids
    * `isSelected` boolean (optional) - Currently selected folders
    * `isRecent` boolean (optional) - Recently accessed folders
  * Returns `Promise<folders: Folder[]>` - Query result `folders`


```
// Get the folder corresponding to the specified id
let folders = await eagle.folder.get({
    ids: ['folder_id1', 'folder_id2']
});

// Get currently selected folders in the application
let folders = await eagle.folder.get({
    isSelected: true
});
```

* * *
getAll()
Get all folders.
  * Returns `Promise<folders: Folder[]>` - Query result `folders`


```
let folders = await eagle.folder.getAll();
```

* * *
getById(folderId)
Get the folder corresponding to `folderId`.
  * `folderId` string - Folder id
  * Returns `Promise<folder: Folder>` - Query result `folder`


```
let folder = await eagle.folder.getById('folder_id');
```

* * *
getByIds(folderIds)
Get an array of folders corresponding to `folderIds`.
  * `folderIds` string[] - Array of folder ids
  * Returns `Promise<folders: Folder[]>` - Query result `folders`


```
let folders = await eagle.folder.getByIds(['folder_id1', 'folder_id2']);
```

* * *
getSelected()
Get the currently selected folders in the application.
  * Returns `Promise<folders: Folder[]>` - `folders`


```
let folders = await eagle.folder.getSelected();
```

* * *
getRecents()
Get the recently used folders.
  * Returns `Promise<folders: Folder[]>` - `folders`


```
let folders = await eagle.folder.getRecents();
```

* * *
open(folderId)
Eagle will open the folder corresponding to `folderId`.
  * Returns `Promise<void>`


```
await eagle.folder.open('folder_id');

// Equivalent to
let folder = await eagle.folder.getById('folder_id');
await folder.open();
```

> ℹ️ **Info:**
Tip: You can also directly call the folder instance's `open()` method to open the folder.
* * *
Class: Folder
An Object type returned by the Folder API `get`, provides modification and save functions.
```
let folder = await eagle.folder.getById('folder_id');

console.log(folder.id);
console.log(folder.name);

folder.name = 'new name';
console.log(folder.name);

await folder.save();
```

circle-check
**🦄 Best Practice:** To ensure data security, please use the `save()` method provided by the Folder instance for data access and modification, and avoid directly modifying the `metadata.json` or any files under the Eagle repository.
* * *
#### 
Instance Methods
**save()**
Save all modifications.
  * Returns `Promise<void>`


```
let folder = await eagle.folder.getById('folder_id');
folder.name = 'New Folder Name';

// Save modifications
await folder.save();
```

* * *
**open()**
Eagle will open this folder.
  * Returns `Promise<void>`


```
let folder = await eagle.folder.getById('folder_id');
await folder.open();

// Equivalent to
await eagle.folder.open('folder_id');
```

> ℹ️ **Info:**
Tip: You can also directly call `eagle.folder.open(folderId)` method to open the folder.
* * *
#### 
Instance Properties
The `Folder` instance includes the following properties:
`**id**`**string**
Read-only, folder id.
`**name**`**string**
Folder name.
`**description**`**string**
Folder description/introduction.
`**icon**`**string**
Read-only, folder icon.
`**iconColor**`**string**
Folder icon color.
```
let folder = await eagle.folder.getById('folder_id');

// Set folder color to red
folder.iconColor = eagle.folder.IconColor.Red;

// Or use string value directly
folder.iconColor = 'red';

// Save changes
await folder.save();
```

> ℹ️ **Info:**
Note: This property was read-only before Eagle 4.0 build12 and did not support modification. Starting from Eagle 4.0 build12, this property can be modified.
`**createdAt**`**Integer**
Read-only, folder creation time (timestamp).
```
let date = new Date(folder.createdAt);
```

`**parent**`**string**
Parent folder ID.
```
let folder = await eagle.folder.getById('folder_id');

// Get parent folder ID
console.log(folder.parent);

// Change parent folder (move folder to another parent folder)
folder.parent = 'parent_folder_id';
await folder.save();

// Move to root directory (set to null or undefined)
folder.parent = null;
await folder.save();
```

> ℹ️ **Info:**
Note: This property was read-only before Eagle 4.0 build12 and did not support modification. Starting from Eagle 4.0 build12, this property can be modified, allowing you to move folders to different parent folders by changing this property.
`**children**`**Folder[]**
Read-only, an array of child folders.
```
let children = folder.children;

console.log(children[0]);
await children[0].open();
```

* * *
Static Properties
`**IconColor**`**Object**
Provides predefined folder icon color constants for setting the folder's `iconColor` property.
```
// Available color constants
eagle.folder.IconColor.Red      // 'red'
eagle.folder.IconColor.Orange   // 'orange' 
eagle.folder.IconColor.Yellow   // 'yellow'
eagle.folder.IconColor.Green    // 'green'
eagle.folder.IconColor.Aqua     // 'aqua'
eagle.folder.IconColor.Blue     // 'blue'
eagle.folder.IconColor.Purple   // 'purple'
eagle.folder.IconColor.Pink     // 'pink'
```

**Usage Examples:**
```
let folder = await eagle.folder.getById('folder_id');

// Use color constants to set folder color
folder.iconColor = eagle.folder.IconColor.Blue;
await folder.save();

// Batch set multiple folder colors
let folders = await eagle.folder.getAll();
for (let i = 0; i < folders.length; i++) {
    if (i % 2 === 0) {
        folders[i].iconColor = eagle.folder.IconColor.Green;
    } else {
        folders[i].iconColor = eagle.folder.IconColor.Purple;
    }
    await folders[i].save();
}
```

circle-check
**🦄 Best Practice:** It's recommended to use `eagle.folder.IconColor` constants instead of string values directly for better code hints and type safety.


## API: tag

*Source: [https://developer.eagle.cool/plugin-api/api/tag](https://developer.eagle.cool/plugin-api/api/tag)*

# tag
The eagle.tag API allows easy access to the tags in the current application.
```
// Get all tags
const tags = await eagle.tag.get();

// Filter tags by name
const designTags = await eagle.tag.get({ name: "design" });

// Get recently used tags
const recents = await eagle.tag.getRecentTags();

// Get starred tags
const starred = await eagle.tag.getStarredTags();
```

Methods
get(options)
Retrieves tags with optional filtering.
  * `options` Object (optional) - Query conditions
    * `name` string (optional) - Filter tags by name with fuzzy search, case-insensitive
  * Returns `Promise<tags: Object[]>` - the query result for tags.


```
// Get all tags
const tags = await eagle.tag.get();

// Filter tags by name
const filteredTags = await eagle.tag.get({
    name: "design"
});
```

> ℹ️ **Info:**
Note: The `name` parameter requires Eagle 4.0 build12 or higher.
* * *
getRecentTags()
Retrieves the most recently used tags.
  * Returns `Promise<tags: Object[]>` - the query result for tags.


```
const recents = await eagle.tag.getRecentTags();
```

* * *
getStarredTags()
Retrieves starred tags (user's favorite tags).
  * Returns `Promise<tags: Object[]>` - the query result for tags.


```
const starred = await eagle.tag.getStarredTags();
```

> ℹ️ **Info:**
Note: The `getStarredTags()` method requires Eagle 4.0 build18 or higher.
* * *
merge(options)
Merges tags: renames the source tag to the target tag, automatically updating all items using the source tag.
  * `options` Object - Option parameters
    * `source` string - Source tag name (will be removed)
    * `target` string - Target tag name (will be kept after merge)
  * Returns `Promise<Object>` - Merge result
    * `affectedItems` number - Number of affected items
    * `sourceRemoved` boolean - Whether the source tag was removed


```
// Merge all "UI Design" tags into "UI"
const result = await eagle.tag.merge({
    source: 'UI Design',
    target: 'UI'
});

console.log(`Merged tags for ${result.affectedItems} items`);
```

> ℹ️ **Info:**
Note: The `merge()` method requires Eagle 4.0 build18 or higher.
> ⚠️ **Warning:**
Warning: The merge operation updates all items, tag groups, starred tags, and history tags that use the source tag. This operation is irreversible.
* * *
Class: Tag
Object type returned by Eagle API `get`, providing modification and save functionality.
circle-check
**🦄 Best Practice:** To ensure data security, use the `save()` method provided by the Tag instance to modify data. Avoid directly modifying tag data in the Eagle resource library.
* * *
Instance Methods
#### 
**save()**
Save tag modifications. Currently only supports modifying tag names.
  * Returns `Promise<result: boolean>` - `result` whether the modification was successful


```
// Get all tags
const tags = await eagle.tag.get();

// Find the tag to modify
const tag = tags.find(t => t.name === 'old-name');

// Modify tag name
tag.name = 'new-name';

// Save changes
await tag.save();
```

> ℹ️ **Info:**
Note: The `save()` method requires Eagle 4.0 build12 or higher.
> ⚠️ **Warning:**
Warning: After modifying a tag name, all files using that tag will automatically be updated with the new tag name.
* * *
Instance Properties
#### 
`**name**`**string**
Tag name. This property can be modified and saved through the `save()` method.
#### 
`**count**`**number**
Read-only, number of files using this tag.
#### 
`**color**`**string**
Tag color.
#### 
`**groups**`**string[]**
Read-only, groups the tag belongs to.
#### 
`**pinyin**`**string**
Read-only, pinyin of tag name (for search and sorting).


## API: tagGroup

*Source: [https://developer.eagle.cool/plugin-api/api/tag-group](https://developer.eagle.cool/plugin-api/api/tag-group)*

# tagGroup
The eagle.tagGroup API allows easy access to the tag groups in the current application.
```
// Get all tag groups
const tagGroups = (await eagle.tagGroup.get());
```

Methods
get()
Retrieves all tag groups.
  * Returns `Promise<tagGroups: Object[]>` - the query result for tagGroups.


```
const tagGroups = (await eagle.tagGroup.get());
```

create(options)
Creates a new tag group.
  * Returns `Promise<tagGroup: Object>` - the newly created tag group.


```
await eagle.tagGroup.create({
    name: "new group",
    color: "red",
    tags: ["tag1", "tag2"],
    description: "Group description"  // Eagle 4.0 build18+
});
```

* * *
**Instance Methods**
save()
Saves changes to the tag group.
  * Returns `Promise<tagGroup: Object>` - the result of the save operation.


```
const tagGroups = (await eagle.tagGroup.get());
const tagGroup = tagGroups[0];

tagGroup.name = "new name";
tagGroup.color = "red"; // red, orange, yellow, green, aqua, blue, purple, pink
tagGroup.tags = ["tag1", "tag2"];
tagGroup.description = "Group description";  // Eagle 4.0 build18+

await tagGroup.save();
```

remove()
Removes the tag group.
  * Returns `Promise<result: boolean>` - whether the removal was successful.


```
const tagGroups = (await eagle.tagGroup.get());
const tagGroup = tagGroups[0];

await tagGroup.remove();
```

addTags(options)
Incrementally adds tags to the group without needing to pass the complete tags array.
  * `options` Object - Option parameters
    * `tags` string[] - Array of tag names to add
    * `removeFromSource` boolean (optional) - Whether to remove tags from their original groups, defaults to `false`
      * `false`: Only add tags (tags can exist in multiple groups)
      * `true`: Move tags (remove from original groups)
  * Returns `Promise<tagGroup: Object>` - The updated tag group


```
const tagGroups = (await eagle.tagGroup.get());
const tagGroup = tagGroups[0];

// Add tags (allow to exist in multiple groups)
await tagGroup.addTags({
    tags: ['UI', 'UX', 'Typography']
});

// Move tags (remove from original groups)
await tagGroup.addTags({
    tags: ['Branding'],
    removeFromSource: true
});
```

> ℹ️ **Info:**
Note: The `addTags()` method requires Eagle 4.0 build18 or higher.
removeTags(options)
Removes specified tags from the group.
  * `options` Object - Option parameters
    * `tags` string[] - Array of tag names to remove
  * Returns `Promise<tagGroup: Object>` - The updated tag group


```
const tagGroups = (await eagle.tagGroup.get());
const tagGroup = tagGroups[0];

// Remove tags from group
await tagGroup.removeTags({
    tags: ['Outdated', 'Draft']
});
```

> ℹ️ **Info:**
Note: The `removeTags()` method requires Eagle 4.0 build18 or higher.
> ⚠️ **Warning:**
Warning: This method only removes tags from the group. It does not delete the tags themselves or affect tags on items.


## API: library

*Source: [https://developer.eagle.cool/plugin-api/api/library](https://developer.eagle.cool/plugin-api/api/library)*

# library
Get information about the repository currently being used by Eagle.
Methods
info()
Get detailed information about the current repository, including folders, smart folders, tag groups, etc.
  * Returns `Promise<data: Object>`
    * `data` Object - Various properties of the repository


```
console.log(await eagle.library.info());
```

* * *
Properties
The `library` module includes the following properties:
`name` string
Returns the name of the current repository
```
console.log(eagle.library.name)
// test
```

`path` string
Returns the path where the current repository is located
```
console.log(eagle.library.path);
// C:\Users\User\Pictures\Design.library
```

`modificationTime` Integer
Returns the last modification time (timestamp)
```
console.log(eagle.library.modificationTime);
// 1681281134495
```


## API: window

*Source: [https://developer.eagle.cool/plugin-api/api/window](https://developer.eagle.cool/plugin-api/api/window)*

# window
Control operations for plugin window display, hide, fullscreen, etc.
Below are common examples of `window` functionalities:
```
await eagle.window.show();            // Show plugin window
await eagle.window.hide();            // Hide plugin window

await eagle.window.minimize();        // Minimize window
await eagle.window.restore();         // Restore minimized

await eagle.window.maximize();        // Maximize window
await eagle.window.unmaximize();      // Restore maximized

await eagle.window.setFullScreen(true);       // Set to fullscreen
await eagle.window.setFullScreen(false);      // Exit fullscreen
```

* * *
#### 
Methods
show()
Show and focus the window.
  * Returns `Promise<>`


```
await eagle.window.show();
```

* * *
showInactive()
Show the window but don't focus on it.
  * Returns `Promise<>`


```
await eagle.window.showInactive();
```

* * *
hide()
Hide the plugin window.
  * Returns `Promise<>`


```
await eagle.window.hide();
```

* * *
focus()
Give the plugin window focus.
  * Returns `Promise<>`


```
await eagle.window.focus();
```

* * *
minimize()
Minimize the plugin window.
  * Returns `Promise<>`


```
await eagle.window.minimize();
```

* * *
isMinimized()
Determine if the window is minimized.
  * Returns `Promise<minimized: boolean>`
    * `minimized` boolean - Whether the window is minimized


```
let isMinimized = await eagle.window.isMinimized();
```

* * *
restore()
Restore the plugin window from a minimized state to its previous state.
  * Returns `Promise<>`


```
await eagle.window.restore();
```

* * *
maximize()
Maximize the plugin window. If the window has not yet been displayed, this method will also show it (but not focus on it).
  * Returns `Promise<>`


```
await eagle.window.maximize();
```

* * *
unmaximize()
Unmaximize the plugin window.
  * Returns `Promise<>`


```
await eagle.window.unmaximize();
```

* * *
isMaximized()
Determine if the window is maximized.
  * Returns `Promise<maximized: boolean>`
    * `maximized` boolean - Whether the window is maximized


```
let isMaximized = await eagle.window.isMaximized();
```

* * *
setFullScreen(flag)
Set whether the window should be in fullscreen mode.
  * `flag` boolean - Whether to set as fullscreen
  * Returns `Promise<>`


```
await eagle.window.setFullScreen(true);        // Enter fullscreen
await eagle.window.setFullScreen(false);       // Exit fullscreen
```

* * *
isFullScreen()
Determine if the window is in fullscreen mode.
  * Returns `Promise<fullscreen: boolean>`
    * `fullscreen` boolean - Whether the window is in fullscreen


```
let isMaximized = await eagle.window.isMaximized();
```

* * *
setAspectRatio(aspectRatio)
This will make the window maintain its aspect ratio.
  * `aspectRatio` Float - The aspect ratio to maintain (width / height)
  * Returns `Promise<>`


```
await eagle.window.setAspectRatio(16/9);        // Restrict the window aspect ratio to 16:9
```

* * *
setBackgroundColor(backgroundColor)
Set the background color of the window.
  * `backgroundColor` String - This parameter represents the HEX code of your desired background color.
  * Returns `Promise<>`


```
await eagle.window.setBackgroundColor("#FFFFFF");
```

> ℹ️ **Info:**
Note 1: This property can be set directly in manifest.json.
Note 2: This setting is mainly used to set the default background color of the window when the HTML/CSS content is not yet complete. Proper setting can avoid the flickering of the window display.
* * *
setSize(width, height)
Set window size.
  * `width` Integer - window width
  * `height` - Integer - window height
  * Returns `Promise<>`


```
await eagle.window.setSize(720, 480);
```

> ℹ️ **Info:**
Note: This property can be set directly in manifest.json.
getSize()
Get window size.
  * Returns `Promise<Integer[]>`


```
await eagle.window.getSize();
```

setBounds(**bounds**)
Adjust the window size and move it to the provided bounds. Any properties not provided will default to their current values.
```
await eagle.window.setBounds({ x: 440, y: 225, width: 800, height: 600 })
```

getBounds()
Get window bounds.
  * Returns `Promise<Rectangle[]>` - object representing the window bounds


```
await eagle.window.getBounds()
```

setResizable(resizable)
Set whether the window supports resizing.
  * `resizable` boolean - whether resizing is supported
  * Returns `Promise<>`


```
await eagle.window.setResizable(true);
await eagle.window.setResizable(false);
```

> ℹ️ **Info:**
Note: This property can be set directly in manifest.json.
* * *
isResizable()
Whether the window supports resizing.
  * Returns `Promise<resizable: boolean>`
    * `resizable` boolean


```
let isResizable = await eagle.window.isResizable();
```

* * *
setAlwaysOnTop(flag)
Set whether the window should always be displayed in front of other windows.
  * `flag` boolean
  * Returns `Promise<>`


```
await eagle.window.setAlwaysOnTop(true);
await eagle.window.setAlwaysOnTop(false);
```

* * *
isAlwaysOnTop()
Whether the window should always be displayed in front of other windows.
  * Returns `Promise<alwaysOnTop: boolean>`
    * `alwaysOnTop` boolean


```
let isAlwaysOnTop = await eagle.window.isAlwaysOnTop();
```

* * *
setPosition(x, y)
Move the window to x and y.
  * `x` Integer
  * `y` Integer
  * Returns `Promise<>`


```
await eagle.window.setPosition(100, 200);
```

* * *
getPosition()
Get plugin window coordinates x and y.
  * Returns `Promise<position: Integer[]>`
    * `position` Integer[]
      * x - position[0]
      * y - position[1]


```
let position = await eagle.window.getPosition();  // [100, 200]
```

* * *
setOpacity(opacity)
Set the opacity of the window, values outside the range are limited to the [0, 1] range.
  * `opacity` number - between 0.0 (completely transparent) and 1.0 (completely opaque)
  * Returns `Promise<>`


```
await eagle.window.setOpacity(0.5);
```

* * *
getOpacity()
Get window opacity, between 0.0 (completely transparent) and 1.0 (completely opaque).
  * Returns `Promise<opacity: number>`
    * `opacity` number


```
let opacity = await eagle.window.getOpacity();
```

* * *
flashFrame(flag)
Start or stop flashing the window to attract the user's attention.
  * `flag` boolean - whether to flash
  * Returns `Promise<>`


```
await eagle.window.flashFrame(true);
await eagle.window.flashFrame(false);
```

* * *
setIgnoreMouseEvents(ignore)
Ignore all mouse events within the window. All mouse events occurring in this window will be passed to the window below it but if this window has focus, it will still receive keyboard events.
  * `ignore` boolean - whether to ignore mouse events
  * Returns `Promise<>`


```
await eagle.window.setIgnoreMouseEvents(true);
await eagle.window.setIgnoreMouseEvents(false);
```

> ℹ️ **Info:**
Combined with the setAlwaysOnTop() feature, you can create a special window that floats at the top of the screen and is permeable to mouse clicks.
capturePage(rect)
Capture a snapshot of the page within the specified `rect` area. Omitting `rect` will capture the entire visible page.
  * `rect` object - Optional, screenshot range
    * `x` number
    * `y` number
    * `width` number
    * `height` number
  * Returns `Promise<[NativeImage](https://www.electronjs.org/docs/latest/api/native-image)>`


```
const image = await eagle.window.capturePage();
const base64 = image.toDataURL("image/jpeg");

const image2 = await eagle.window.capturePage({ x: 0, y: 0, width: 100, height: 50 });
const buffer = image2.toPNG();
```

setReferer(url)
Sets the current referer URL. Once set, subsequent requests will utilize this referer.
  * `url` string - The URL of the referer.
  * Returns `void`


```
eagle.window.setReferer("https://en.eagle.cool");
```


## API: app

*Source: [https://developer.eagle.cool/plugin-api/api/app](https://developer.eagle.cool/plugin-api/api/app)*

# app
Retrieve Eagle application attributes like version, architecture, and language.
Here are common attributes for the `app`:
```
console.log(eagle.app.version);                // Eagle version
console.log(eagle.app.build);                  // Eagle Build number
console.log(eagle.app.locale);                 // Application interface language, en/zh_CN/zh_TW/ja_JP
console.log(eagle.app.arch);                   // x86 | x64
console.log(eagle.app.platform);               // darwin | win32
console.log(eagle.app.isWindows);              // true | false, whether the operating system is Windows
console.log(eagle.app.isMac);                  // true | false, whether the operating system is Mac
console.log(eagle.app.runningUnderARM64Translation);   // Whether it is running in rosetta translation mode
```

* * *
Methods
isDarkColors()
Check if the current system is in dark (Dark) mode.
  * Returns `boolean` - Whether the current system is in Dark mode.


```
eagle.app.isDarkColors();        // true | false
```

* * *
getPath(name)
You can request the following paths by name:
  * `name` string - You can request the following paths by name:
    * `home` - User's home folder (main directory)
    * `appData` - Application data directory for each user, defaults to:
    * `userData` - Folder for storing your application configuration files, default is the appData folder plus the application's name. User data files should be written here by convention, but it is not recommended to write large files, as some environments will back up this directory to cloud storage.
    * `temp` - Temporary folder
    * `exe` - Current executable file
    * `desktop` - Current user's desktop folder
    * `documents` - Path of the user's documents directory
    * `downloads` - Path of the user's download directory
    * `music` - Path of the user's music directory
    * `pictures` - Path of the user's picture directory
    * `videos` - Path of the user's video directory
    * `recent` - Directory of the user's recent files (Windows only).
  * Returns `Promise<path: string>` - `path` query path result.


```
await eagle.app.getPath('appData');   // 'C:\Users\User\AppData\Roaming'
await eagle.app.getPath('pictures');   // 'C:\Users\User\Pictures'
await eagle.app.getPath('desktop');    // 'C:\Users\User\Desktop'
```

> ℹ️ **Info:**
Note: This feature is similar to Electron API's [app.getPath](https://www.electronjs.org/zh/docs/latest/api/app#appgetapppath) feature.
* * *
getFileIcon(path[, options])
Get the icon associated with the specified path file.
  * `path` string - File path for which you want to get the icon
  * `options` Object (optional)
    * `size` string
    * `small` - 16x16
    * `normal` - 32x32
    * `large` - 32x32 on `Windows`, not supported on `macOS`.
  * Returns `Promise<img: NativeImage>`
    * `img` [NativeImage](https://www.electronjs.org/zh/docs/latest/api/native-image) - A NativeImage type application icon.


```
let img = await eagle.app.getFileIcon('path_to_file', { size: 'small' });

// Get image information
let base64 = img.toDataURL();
let size = img.getSize();   // {'width': 16, height: 16}

// Save to computer
let buffer = img.toPNG();
require('fs').writeFileSync('output_path/example.png', buffer);
```

> ℹ️ **Info:**
Note: This feature is similar to Electron API's [app.getAppIcon](https://www.electronjs.org/zh/docs/latest/api/app#appgetfileiconpath-options) feature.
* * *
createThumbnailFromPath(path, maxSize)
Get the icon associated with the file at the specified path.
  * `path` string - The file path to get the thumbnail from
  * `maxSize` Size - The maximum width and height (positive number) of the returned thumbnail. On Windows platform, maxSize.height will be ignored and height will be scaled according to maxSize.width
  * Returns `Promise<img: NativeImage>`
    * `img` [NativeImage](https://www.electronjs.org/zh/docs/latest/api/native-image) - The thumbnail preview image of the file.


```
let img = await eagle.app.createThumbnailFromPath('path_to_file', { 
    height: 200, 
    width: 200 
});

// Obtain image information
let base64 = img.toDataURL();
let size = img.getSize();	// {'width': 200, height: 150}

// Save to computer
let buffer = img.toPNG();
require('fs').writeFileSync('output_path/example.png', buffer);
```

> ℹ️ **Info:**
Note: This function is similar to the Electron API's [nativeImage.createThumbnailFromPath(path, maxSize)](https://www.electronjs.org/zh/docs/latest/api/native-image#nativeimagecreatethumbnailfrompathpath-maxsize-macos-windows) function.
* * *
show()
Brings the Eagle main application window to the front and displays it on top.
  * Returns `Promise<boolean>` - Whether the operation was successful.


```
await eagle.app.show();
```

> ℹ️ **Info:**
Note: This feature requires Eagle 4.0 build18 or later.
* * *
Properties
version
`string` property, get the current Eagle application version.
build
`number` property, get the current Eagle application Build Number.
locale
`string` property, get the current Eagle application interface language.
  * `en` - English
  * `zh_CN` - Simplified Chinese
  * `zh_TW` - Traditional Chinese
  * `ja_JP` - Japanese
  * `ko_KR` - Korean
  * `es_ES` - Spanish
  * `de_DE` - German
  * `ru_RU` - Russian


arch
`string` property, returns the CPU architecture of the operating system.
  * `x64`
  * `arm64`
  * `x86`


platform
`string` property, returns a string identifying the operating system platform.
  * `darwin` - macOS operating system
  * `win32` - Windows operating system


env
`Object` property, returns an object of environment variables.
```
console.log(eagle.app.env);

{
  APPDATA: "C:\\Users\\User\\AppData\\Roaming",
  HOMEDRIVE: "C:",
	HOMEPATH: "\\Users\\User",
  LANG: "zh_TW.UTF-8",
  TEMP: "C:\\Users\\User\\AppData\\Local\\Temp"
}
```

```
console.log(eagle.app.env['TEMP']);

"C:\\Users\\User\\AppData\\Local\\Temp"
```

execPath
`string` property, current application execution path.
```
console.log(eagle.app.execPath);

"C:\\Program Files\\Eagle\\Eagle.exe"
```

pid
`number` property, current plugin process id.
isWindows
`boolean` property, is the current operating system Windows.
isMac
`boolean` property, is the current operating system Mac.
runningUnderARM64Translation
`boolean` property, when true it indicates that the current application is running in ARM64 runtime (e.g., macOS [Rosetta Translator Environment](https://en.wikipedia.org/wiki/Rosetta_\(software\)) or Windows [WOW](https://en.wikipedia.org/wiki/Windows_on_Windows)).
> ℹ️ **Info:**
Hint: This function is similar to the Electron API's [app.runningUnderARM64Translation](https://www.electronjs.org/zh/docs/latest/api/app#apprunningunderarm64translation-%E5%8F%AA%E8%AF%BB-macos-windows) function. You can use this property to prompt users to download the arm64 version of the application when they mistakenly run the x64 version in a translation environment.
theme
`string` property, the current theme color name, such as `LIGHT`, `LIGHTGRAY`, `GRAY`, `DARK`, `BLUE`, `PURPLE`.
userDataPath
`string` property, the path to the current user data directory.
```
console.log(eagle.app.userDataPath);

"C:\\Users\\User\\AppData\\Roaming\\Eagle"
```

> ℹ️ **Info:**
Note: This feature requires Eagle 4.0 build12 or higher.


## API: os

*Source: [https://developer.eagle.cool/plugin-api/api/os](https://developer.eagle.cool/plugin-api/api/os)*

# os
Similar to the os module in Node.js, provides some basic system operation functions.
Methods
tmpdir()
Get the default temporary file path of the operating system.
  * Returns `string` - The default temporary file path of the operating system


```
eagle.os.tmpdir();         // 'C:\\Users\\User\\AppData\\Local\\Temp'
```

* * *
version()
Get the string of the operating system kernel version.
  * Returns `string` - The string of the operating system kernel version


```
eagle.os.version();         // 'Windows 10 Home'
```

* * *
type()
Returns the name of the operating system. For example: returns `Darwin` on macOS, and `Windows_NT` on Windows.
  * Returns `string` - The name of the operating system


```
eagle.os.type();         // 'Windows_NT', 'Darwin'
```

* * *
release()
Returns the release version of the operating system.
  * Returns `string` - The release version of the operating system


```
eagle.os.release();         // '10.0.22621'
```

* * *
hostname()
Returns the hostname of the operating system.
  * Returns `string` - The hostname of the operating system


```
eagle.os.hostname();         // 'My_Windows'
```

* * *
homedir()
Returns the home directory of the current user.
  * Returns `string` - The home directory of the current user


```
eagle.os.homedir();         // 'C:\\Users\\User'
```

* * *
arch()
Returns the CPU architecture of the operating system.
  * Returns `string` - The current CPU architecture
    * `x64`
    * `arm64`
    * `x86`


```
eagle.os.arch();         // 'x64'
```


## API: screen

*Source: [https://developer.eagle.cool/plugin-api/api/screen](https://developer.eagle.cool/plugin-api/api/screen)*

# screen
Get information about screen size, display, cursor position, etc.
Methods
getCursorScreenPoint()
Absolute position x, y of the current mouse cursor.
  * Returns `Promise<point: Object>`
    * `point` Object
      * `point.x`
      * `point.y`


```
let point = await eagle.screen.getCursorScreenPoint();
```

* * *
getPrimaryDisplay()
Returns primary display information.
  * Returns `Promise<display: Display>`
    * `display` [Display](https://www.electronjs.org/docs/latest/api/structures/display) Object - Current display information.


```
let display = await eagle.screen.getPrimaryDisplay();
```

* * *
getAllDisplays()
Returns an array Display[], representing currently available screens.
  * Returns `Promise<displays: Display[]>`
    * `displays` [Display](https://www.electronjs.org/docs/latest/api/structures/display)[]


```
let displays = await eagle.screen.getAllDisplays();
```

* * *
getDisplayNearestPoint(point)
Gets the plugin window coordinates x and y.
  * `point` Object
    * `point.x` Integer type
    * `point.y` Integer type
  * Returns `Promise<display: Display>`
    * `display` [Display](https://www.electronjs.org/docs/latest/api/structures/display) Object - Current display information.


```
let display = await eagle.screen.getDisplayNearestPoint({ x: 100, y: 100 });
```


## API: notification

*Source: [https://developer.eagle.cool/plugin-api/api/notification](https://developer.eagle.cool/plugin-api/api/notification)*

# notification
Display a pop-up window in the corner of the screen to inform users about operation status.
Methods
show(options)
Display a notification window
  * `options` Object
    * `title` string - Notification window title
    * `body` string - Notification window description
    * `icon` URL/base64 - Notification window icon, supporting URL or base64 format (optional)
    * `mute` boolean - Sound effect (optional)
    * `duration` Integer - Auto-hide duration (milliseconds) (optional)
  * Returns `Promise<>`


```
await eagle.notification.show({
    title: "Basic Notification",
    body: "Notification from the Plugin process",
    mute: false,
    duration: 3000,
    icon: "https://"
});
```

* * *


## API: contextMenu

*Source: [https://developer.eagle.cool/plugin-api/api/context-menu](https://developer.eagle.cool/plugin-api/api/context-menu)*

# contextMenu
Create native application context menus.
Methods
open(menuItems)
Pops up the right-click menu.
  * `menuItems` : [MenuItem](https://www.electronjs.org/docs/latest/api/menu-item)
    * `id` string - Menu item ID
    * `label` string - Text displayed for the menu item
    * `submenu` [MenuItem] - Submenu


```
eagle.contextMenu.open([
    {
        id: "edit",
        label: "Edit",
        submenu: [
            {
                id: "resize",
                label: "Resize",
                click: () => { alert("Image resized") }
            },
            {
                id: "crop",
                label: "Crop",
                click: () => { alert("Image cropped") }
            },
            {
                id: "rotate",
                label: "Rotate",
                click: () => { alert("Image rotated") }
            }
        ]
    },
    {
        id: "effects",
        label: "Effects",
        submenu: [
            {
                id: "grayscale",
                label: "Grayscale",
                click: () => { alert("Grayscale effect applied") }
            },
            {
                id: "sepia",
                label: "Sepia",
                click: () => { alert("Sepia effect applied") }
            },
            {
                id: "invert",
                label: "Invert Colors",
                click: () => { alert("Color inversion applied") }
            }
        ]
    },
    {
        id: "export",
        label: "Export",
        click: () => { alert("Image exported") }
    }
])
```


## API: dialog

*Source: [https://developer.eagle.cool/plugin-api/api/dialog](https://developer.eagle.cool/plugin-api/api/dialog)*

# dialog
System dialog functionality, including opening, saving files, prompts, alerts, etc.
Below is an example of a dialog box for selecting multiple files:
```
let result = await eagle.dialog.showOpenDialog({ 
    properties: ['openFile', 'multiSelections'] 
});
```

* * *
#### 
Methods
showOpenDialog(options)
Displays the open file dialog.
  * `options` Object
    * `title` string (optional) - The title of the dialog window
    * `defaultPath` string (optional) - The default display path of the dialog
    * `buttonLabel` string (optional) - Custom label for the "Confirm" button; if empty, the default label is used.
    * `filters` [FileFilter](https://www.electronjs.org/zh/docs/latest/api/structures/file-filter)[] (optional)
      * `name` string
      * `extensions` string[]
    * `properties` string[] (optional) - Contains dialog-related attributes. The following attribute values are supported:
      * `openFile` - Allows selecting files
      * `openDirectory` - Allows selecting folders
      * `multiSelections`- Allows multiple selections.
      * `showHiddenFiles`- Displays hidden files in the dialog.
      * `createDirectory` `macOS` - Allows you to create a new directory through the dialog.
      * `promptToCreate` `Windows`- If the entered file path does not exist in the dialog, prompt to create it. This does not actually create a file on the path but allows returning some non-existent addresses for the application to create.
    * `message` string (optional) `macOS` - The message displayed above the input box.
  * Returns `Promise<result: Object>`
    * `result`Object
      * `canceled` boolean - Whether the dialog was canceled
      * `filePaths` string[] - Array of chosen file paths by the user. If the dialog is canceled, this will be an empty array.


```
{
  filters: [
    { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
    { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
    { name: 'Custom File Type', extensions: ['as'] },
    { name: 'All Files', extensions: ['*'] }
  ]
}
```

```
let result = await eagle.dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
});
```

> ℹ️ **Info:**
Note: This feature is similar to Electron API's [dialog.showOpenDialog](https://www.electronjs.org/zh/docs/latest/api/dialog#dialogshowopendialogbrowserwindow-options) feature.
* * *
showSaveDialog(options)
Displays the save file dialog.
  * `options` Object
    * `title` string (optional) - The title of the dialog window
    * `defaultPath` string (optional) - The default display path of the dialog
    * `buttonLabel` string (optional) - Custom label for the "Confirm" button; if empty, the default label is used.
    * `filters` [FileFilter](https://www.electronjs.org/zh/docs/latest/api/structures/file-filter)[] (optional)
      * `name` string
      * `extensions` string[]
    * `properties` string[] (optional) - Contains dialog-related attributes. The following attribute values are supported:
      * `openDirectory` - Allows selecting folders
      * `showHiddenFiles`- Displays hidden files in the dialog.
      * `createDirectory` `macOS` - Allows you to create a new directory through the dialog.
  * Returns `Promise<result: Object>`
    * `result`Object
      * `canceled` boolean - Whether the dialog was canceled
      * `filePath` string - If the dialog is canceled, this value will be `undefined`.


```
{
  filters: [
    { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
    { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
    { name: 'Custom File Type', extensions: ['as'] },
    { name: 'All Files', extensions: ['*'] }
  ]
}
```

```
let result = await eagle.dialog.showSaveDialog({
    properties: ['openDirectory']
});
```

> ℹ️ **Info:**
Note: This function is similar to the Electron API's [dialog.showSaveDialog](https://www.electronjs.org/zh/docs/latest/api/dialog#dialogshowsavedialogbrowserwindow-options) function.
* * *
showMessageBox(options)
Display a message dialog.
  * `options` Object
    * `message` string - The main content of the dialog
    * `title` string (optional) - Dialog title
    * `detail` string (optional) - Additional information
    * `buttons` strings[] (optional) - Array of button texts
    * `type` string (optional) - Can be `none`, `info`, `error`, `question`, or `warning`
  * Returns `Promise<result: Object>`
    * `result` Object
      * `response` Integer - The index of the clicked button


```
let result = await eagle.dialog.showMessageBox({
    title: "Messagebox title",
    message: "Message from the Plugin process",
    detail: "Ultra message here",
    buttons: ["OK", "Cancel"],
    type: "info"
});

console.log(result);		// {response: 0}
```

> ℹ️ **Info:**
This function is similar to the Electron API's [dialog.showSaveDialog](https://www.electronjs.org/zh/docs/latest/api/dialog#dialogshowsavedialogbrowserwindow-options) function.
* * *
showErrorBox(title, content)
Display an error message dialog.
  * `title` string - The title displayed in the error box
  * `content` string - The text content displayed in the error box
  * Returns `Promise<void>`


```
await eagle.dialog.showErrorBox("Error box title", "Error message from the Plugin process");
```

> ℹ️ **Info:**
Note: This function is similar to the Electron API's [dialog.showSaveDialog](https://www.electronjs.org/zh/docs/latest/api/dialog#dialogshowsavedialogbrowserwindow-options) function.


## API: clipboard

*Source: [https://developer.eagle.cool/plugin-api/api/clipboard](https://developer.eagle.cool/plugin-api/api/clipboard)*

# clipboard
Perform copy and paste operations on the system clipboard.
> ℹ️ **Info:**
Tip: It is recommended to use Clipboard Viewer ([Win](https://freeclipboardviewer.com/) / [Mac](https://langui.net/clipboard-viewer/)) tool for development debugging to make the development process smoother.
```
await eagle.clipboard.writeText('Example string');

console.log(await eagle.clipboard.readText());
```

* * *
Methods
clear()
Clear the clipboard content.
```
eagle.clipboard.writeText('Example string');
eagle.clipboard.clear();
console.log(eagle.clipboard.readText());	// undefined
```

* * *
has(format)
Check if the current clipboard content contains the specified format.
  * `format` string - Specified format
  * Returns boolean - Whether it contains the specified format


```
console.log(eagle.clipboard.has('public/utf8-plain-text'));	// false

const buffer = Buffer.from('writeBuffer', 'utf8');
eagle.clipboard.writeBuffer('public/utf8-plain-text', buffer);

console.log(eagle.clipboard.has('public/utf8-plain-text'));	// true
```

* * *
writeText(text)
Write `text` as plain text to the clipboard.
  * `text` string - Text to be written


```
eagle.clipboard.writeText('Example string');
console.log(eagle.clipboard.readText());	// 'Example string'
```

* * *
readText()
Get the plain text content of the current clipboard.
  * Returns string


```
console.log(await eagle.clipboard.readText());
```

* * *
writeBuffer(format, buffer)
Write `buffer` as `format` type to the clipboard.
  * `format` string - Clipboard format
  * `buffer` Buffer - Buffer format of the content to be written


```
const buffer = Buffer.from('writeBuffer', 'utf8');
eagle.clipboard.writeBuffer('public/utf8-plain-text', buffer);
```

* * *
readBuffer(format)
Read `format` type content from the clipboard.
  * Returns Buffer


```
const buffer = Buffer.from('this is binary', 'utf8');
eagle.clipboard.writeBuffer('public/utf8-plain-text', buffer);

const out = eagle.clipboard.readBuffer('public/utf8-plain-text');

console.log(buffer.equals(out));	// true
```

* * *
writeImage(image)
Write `image` to the clipboard.
  * `image` [NativeImage](https://www.electronjs.org/docs/latest/api/native-image) - Image to be written to the clipboard


```
let img = nativeImage.createFromPath('path_to_img_file');
eagle.clipboard.writeImage(img);
```

* * *
readImage()
Read image format content from the clipboard.
  * Returns [NativeImage](https://www.electronjs.org/docs/latest/api/native-image)


```
let input = nativeImage.createFromPath('path_to_img_file');
eagle.clipboard.writeImage(input);

let output = eagle.clipboard.readImage();
```

* * *
writeHTML(markup)
Write `markup` as HTML format to the clipboard.
  * `markup` string


```
eagle.clipboard.writeHTML('<b>Hi</b>');
console.log(eagle.clipboard.readHTML());	// <b>Hi</b>
```

* * *
readHTML()
Read HTML format content from the clipboard.
  * Returns string


```
eagle.clipboard.writeHTML('<b>Hi</b>');
console.log(eagle.clipboard.readHTML());	// <b>Hi</b>
```

* * *
copyFiles(paths)
Copy the specified files to the clipboard, supporting paste in file manager.
  * `paths` strings[] - Files to be copied to the clipboard.


```
eagle.clipboard.copyFiles([
    'path_to_file',
    'path_to_file2'
]);
```

* * *


## API: drag

*Source: [https://developer.eagle.cool/plugin-api/api/drag](https://developer.eagle.cool/plugin-api/api/drag)*

# drag
Implement native system file drag-and-drop functionality.
#### 
Method
startDrag(filePaths)
Display notification window
  * `filePaths` string[] - File paths to drag
  * Returns `Promise<>`


```
await eagle.drag.startDrag([
    "C:\\Users\\User\\Pictures\\drag1.jpg",
    "C:\\Users\\User\\Pictures\\drag2.jpg",
]);
```

> ℹ️ **Info:**
Note: This function is similar to Electron API's [webContents.startDrag(item)](https://www.electronjs.org/en/docs/latest/tutorial/native-file-drag-drop) feature.
#### 


## API: shell

*Source: [https://developer.eagle.cool/plugin-api/api/shell](https://developer.eagle.cool/plugin-api/api/shell)*

# shell
Manage files and URLs using default applications.
The `shell` module provides functionalities related to desktop integration.
* * *
#### 
Methods
beep()
Plays the system's beep sound.
  * Returns `Promise<void>`


```
await eagle.shell.beep();
```

* * *
openExternal(url)
Opens the specified URL using the system's default method. Note: This function will not have any effect if there is no default application set by the system.
  * `url` string - The URL to be opened
  * Returns `Promise<void>`


```
await eagle.shell.openExternal('https://www.google.com/');
```

* * *
openPath(path)
Opens the specified path using the system's default method.
  * `path` string - The file path to be opened
  * Returns `Promise<void>`


```
await eagle.shell.openPath('path_to_file');
```

* * *
showItemInFolder(path)
Shows the specified file or folder in the file manager.
  * `path` string - The file or folder to be displayed
  * Returns `Promise<void>`


```
await eagle.shell.showItemInFolder('path_to_file_or_directory');
```


## API: log

*Source: [https://developer.eagle.cool/plugin-api/api/log](https://developer.eagle.cool/plugin-api/api/log)*

# log
Log specific information in Eagle software for debugging and troubleshooting during development.
> ℹ️ **Info:**
Click here to see how to obtain Eagle [software logs](https://docs-cn.eagle.cool/article/92-how-do-i-get-the-error-log).
```
eagle.log.debug('debug message from plugin');
eagle.log.info('info message from plugin');
eagle.log.warn('warn message from plugin');
eagle.log.error('error message from plugin');

// [13:19:39.845] [debug] [plugin] "debug message from plugin"
// [13:19:39.845] [info] [plugin] "info message from plugin"
// [13:19:39.845] [warn] [plugin] "warn message from plugin"
// [13:19:39.845] [error] [plugin] "error message from plugin"
```

* * *
#### 
Methods
debug(obj)
Log debug-type content to the software log
  * `obj` Object - The content to be recorded, can be `Object`, `String`, `Array`, and other formats


```
eagle.log.debug(obj);
eagle.log.debug(array);
eagle.log.debug('error message from plugin');
```

* * *
info(obj)
Log info-type content to the software log
  * `obj` Object - The content to be recorded, can be `Object`, `String`, `Array`, and other formats


* * *
warn(obj)
Log warn-type content to the software log
  * `obj` Object - The content to be recorded, can be `Object`, `String`, `Array`, and other formats


* * *
error(obj)
Log error-type content to the software log
  * `obj` Object - The content to be recorded, can be `Object`, `String`, `Array`, and other formats


```
try {
    let a = {};
    a.b.c = 'test';
}
catch (err) {
    eagle.log.error('error message from plugin');
    eagle.log.error(err.stack || err);
}

// [13:23:24.191] [error] [plugin] "error message from plugin"
// [13:23:24.191] [error] [plugin] "TypeError: Cannot set properties of undefined (setting 'c')\n    at <anonymous>:3:11"
```

* * *


---

# 🧩 Extra Modules


## FFmpeg

*Source: [https://developer.eagle.cool/plugin-api/extra-module/ffmpeg](https://developer.eagle.cool/plugin-api/extra-module/ffmpeg)*

# FFmpeg
This plugin provides dependency support for FFmpeg, giving developers a wide range of image, video, and audio encoding and decoding capabilities.
> ⚠️ **Warning:**
Note: This feature can only be used in Eagle 4.0 beta 7 and above.
Introduction to FFmpeg Dependency Plugin
The "FFmpeg Dependency Plugin" is a toolkit for browser plugin developers, encapsulating the powerful multimedia processing capabilities of FFmpeg into an easy-to-use dependency package. This toolkit allows developers to easily implement image, video, and audio format encoding and decoding, as well as advanced features such as streaming media processing and format conversion, in their own plugins. By integrating the "FFmpeg Dependency Plugin", developers can seamlessly expand the multimedia processing capabilities of their plugins, bringing more creative and practical features to users.
Installing the FFmpeg Dependency Plugin
  1. Enter the plugin center
  2. Search and find the FFmpeg plugin
  3. Click to install the FFmpeg plugin


> ℹ️ **Info:**
Please note that when users install plugins with FFmpeg dependencies, Eagle will automatically prompt users to install the "FFmpeg Dependency Plugin". Therefore, developers do not need to specifically write code for users to install, just provide corresponding prompts for possible errors.
How to Use the FFmpeg Dependency Plugin
If you want to use FFmpeg related functions in your plugin, you need to add a `dependencies` definition in the plugin's `manifest.json` file, so that the Eagle system knows that this plugin needs additional extension functions, as shown below:
```
{
    "id": "LBCZE8V6LPCKD",
    "version": "1.0.0",
    "platform": "all",
    "arch": "all",
    "name": "Window Plugin",
    "logo": "/logo.png",
    "keywords": [],
    "dependencies": ["ffmpeg"],
    "devTools": false,
    "main":
    {
        "url": "index.html",
        "width": 640,
        "height": 480,
    }
}
```

Window Plugin Example
You can use `eagle.extraModule.ffmpeg` to call the functions provided by the FFmpeg dependency plugin, as shown below:
```
eagle.onPluginCreate(async (plugin) => {

    // Check if the FFmpeg dependency plugin is installed
    const isFFemptInstalled = await eagle.extraModule.ffmpeg.isInstalled();
    
    // Open the plugin center and pop up the FFmpeg dependency plugin installation page.
    if (!isFFemptInstalled) {
        await eagle.extraModule.ffmpeg.install();
        return;
    }
    
    // Get the location of the FFmpeg binary file
    const ffmpegPaths= await eagle.extraModule.ffmpeg.getPaths();
    const ffmpegBinaryPath = ffmpegPaths.ffmpeg;
    const ffprobeBinaryPath = ffmpegPaths.ffprobe;
    
    // Use the spwan command to perform related operations
    const spawn = require('child_process').spawn;
    const ffprobe = spawn(ffprobePath, [
	'-v', 'error',
	'-print_format', 'json',
	'-show_format',
	'-show_streams',
	"C:\\your_file.mp4"
    ]);
});
```

Thumbnail Plugin Example
You can get FFmpeg related functions through the `extraModule` parameter, as shown below:
```

module.exports = async ({ src, dest, item, plugin, extraModule }) => {
    return new Promise(async (resolve, reject) => {
        try {
        
            const ffmpegModule = extraModule.ffmpeg;
	
            // Check if the FFmpeg dependency plugin is installed
            if (!ffmpegModule.isInstalled) {
		return reject(new Error(`ffmpeg is not installed.`));
	    }
	    
            // Get the location of the FFmpeg binary file
            const { ffmpeg, ffprobe } = ffmpegModule.paths;
            
            // Use the spwan command to perform related operations
            const spawn = require('child_process').spawn;
            const ffprobe = spawn(ffprobePath, [
	        '-v', 'error',
        	'-print_format', 'json',
	        '-show_format',
	        '-show_streams',
	        "C:\\your_file.mp4"
            ]);
            
            return resolve(item);
        }
        catch (err) {
            return reject(err);
        }
    });
}
```


## AI SDK

*Source: [https://developer.eagle.cool/plugin-api/extra-module/ai-sdk](https://developer.eagle.cool/plugin-api/extra-module/ai-sdk)*

# AI SDK
This plugin provides a unified AI model configuration center, supporting all major mainstream AI models. Configure once, use everywhere, without the need to repeatedly set API Keys.
> ⚠️ **Warning:**
Note: This feature can only be used in Eagle 5.0 Beta and above (currently unreleased, please follow Eagle's official website for detailed release information).
* * *
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FNNAsNMBolZGdsAI9neFh%252Fimage.png%3Falt%3Dmedia%26token%3D12bd6d78-d516-428d-b681-1a268f886cc6&width=768&dpr=3&quality=100&sign=7a5709ba&sv=2)
Introduction to AI SDK Dependency Plugin
The "AI SDK Dependency Plugin" is a development toolkit for browser plugin developers, providing a unified AI model configuration center that supports all major mainstream AI models. Configure once, use everywhere. This toolkit allows developers to easily implement AI functions such as text generation, structured object generation, and streaming processing in their own plugins. By integrating the "AI SDK Dependency Plugin", developers can seamlessly expand their plugin's AI processing capabilities, bringing more intelligent and practical features to users.
Unified Configuration Center: Configure Once, Use Everywhere
The AI SDK plugin provides a unified AI model configuration center, supporting:
**Commercial Models** :
  * OpenAI (GPT-4, GPT-4 Vision)
  * Anthropic Claude (Claude 3 Opus, Claude 3.5 Sonnet)
  * Google Gemini (Gemini Pro, Gemini Ultra)
  * DeepSeek (DeepSeek Chat, DeepSeek Coder)
  * Alibaba Qwen (Tongyi Qianwen)


**Local Models** (completely offline operation):
  * Ollama (supporting Llama 3, Mistral, Phi-3, etc.)
  * LM Studio (graphical interface, beginner-friendly)


After configuring once, all AI-related plugins can use it directly without repeated settings. For example: if you install "AI Translation" and "AI Rename" plugins today, they will automatically share the configuration you filled in the SDK, and can even choose different models individually, without requiring you to enter API Keys again.
![](https://developer.eagle.cool/plugin-api/~gitbook/image?url=https%3A%2F%2F1590693372-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F8ag8XBIM3olHOU7WmBBx%252Fuploads%252FyhZq3RizlsISKSmTZOoA%252Fimage.png%3Falt%3Dmedia%26token%3D9f857c80-f260-45d4-9793-1c2fad7d5974&width=768&dpr=3&quality=100&sign=1ee2cb78&sv=2)
Open Development Environment
Based on [ai-sdk.dev](https://ai-sdk.dev/) standards (AI SDK v5), the AI SDK plugin provides developers with a set of clean and stable infrastructure. Developers no longer need to spend effort handling basic configurations such as API Key storage, model switching, and error retry, and can focus on plugin innovation. The only difference is in Provider acquisition - we use our own developed Providers to ensure better stability and user experience.
> ⚠️ **Warning:**
**Version Compatibility** : This plugin is built on AI SDK v5. If you're familiar with newer versions (v6, v7, etc.) of AI SDK, please note that some APIs or features may differ. Always refer to this documentation for the correct usage within Eagle's ecosystem.
* * *
Installing the AI SDK Dependency Plugin
  1. Enter the plugin center
  2. Search and find the AI SDK plugin
  3. Click to install the AI SDK plugin


> ℹ️ **Info:**
Please note that when users install plugins with AI SDK dependencies, Eagle will automatically prompt users to install the "AI SDK Dependency Plugin". Therefore, developers do not need to specifically write code for users to install, as the system will automatically ensure related dependencies are installed before allowing plugins to run.
* * *
How to Use the AI SDK Dependency Plugin
If you want to use AI SDK related functions in your plugin, you need to add a `dependencies` definition in the plugin's `manifest.json` file, so that the Eagle system knows this plugin needs additional extension functions, as shown below:
```
{
    "id": "LBCZE8V6LPCKD",
    "version": "1.0.0",
    "platform": "all",
    "arch": "all",
    "name": "Window Plugin",
    "logo": "/logo.png",
    "keywords": [],
    "dependencies": ["ai-sdk"],
    "devTools": false,
    "main":
    {
        "url": "index.html",
        "width": 640,
        "height": 480,
    }
}
```

Window Plugin Example
You can use `eagle.extraModule.ai` to call the functions provided by the AI SDK dependency plugin. Here are examples of various usage methods:
#### 
generateText() - Basic Text Generation
```
eagle.onPluginCreate(async (plugin) => {
    // Get AI module and Provider
    const ai = eagle.extraModule.ai;
    const { openai, anthropic, gemini, deepseek, qwen, ollama, lmstudio } = await ai.getProviders();
    const { generateText } = ai;

    // Basic text generation
    const result = await generateText({
        model: openai("gpt-5"),
        prompt: "Please help me write a creative introduction about digital art",
    });

    console.log(result.text);
});
```

#### 
generateObject() - Structured Object Generation
```
eagle.onPluginCreate(async (plugin) => {
    const ai = eagle.extraModule.ai;
    const { openai } = await ai.getProviders();
    const { generateObject } = ai;

    // Generate structured data
    const result = await generateObject({
        model: anthropic("claude-4-sonnet"),
        schema: {
            type: "object",
            properties: {
                tags: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            reason: { type: "string" },
                        },
                    },
                },
                description: { type: "string" },
            },
        },
        messages: [
            {
                role: "system",
                content: "You are a professional image analysis expert who can accurately identify image content and provide appropriate tags and descriptions.",
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Please analyze this image and provide 5 related tags, each tag needs to explain the reason, and provide a concise image description.",
                    },
                    {
                        type: "image",
                        image: "https://example.com/sample-image.jpg",
                    },
                ],
            },
        ],
    });

    console.log("Tags:", result.object.tags);
    console.log("Description:", result.object.description);
});
```

#### 
streamText() - Streaming Text Generation
```
eagle.onPluginCreate(async (plugin) => {
    const ai = eagle.extraModule.ai;
    const { openai } = await ai.getProviders();
    const { streamText } = ai;

    // Stream text generation, suitable for real-time display
    const { textStream } = await streamText({
        model: gemini("gemini-2.0-flash-exp"),
        prompt: "Please provide a detailed introduction to the development history and main characteristics of digital art",
    });

    // Gradually receive and display generated text
    for await (const textPart of textStream) {
        console.log(textPart);
    }
});
```

#### 
streamObject() - Streaming Object Generation
```
eagle.onPluginCreate(async (plugin) => {
    const ai = eagle.extraModule.ai;
    const { openai } = await ai.getProviders();
    const { streamObject } = ai;

    // Stream structured object generation
    const { partialObjectStream } = await streamObject({
        model: deepseek("deepseek-chat"),
        schema: {
            type: "object",
            properties: {
                analysis: {
                    type: "object",
                    properties: {
                        colors: {
                            type: "array",
                            items: { type: "string" }
                        },
                        style: { type: "string" },
                        mood: { type: "string" },
                        suggestions: {
                            type: "array",
                            items: { type: "string" }
                        }
                    }
                }
            },
        },
        messages: [
            {
                role: "system",
                content: "You are an art critic who can deeply analyze artworks' colors, styles, emotions, and improvement suggestions.",
            },
            {
                role: "user",
                content: "Please analyze this artwork's color combinations, artistic style, emotions conveyed, and provide improvement suggestions.",
            },
        ],
    });

    // Gradually receive partial objects
    for await (const partialObject of partialObjectStream) {
        console.log("Current analysis result:", partialObject);
    }
});
```

> ℹ️ **Info:**
**Important Reminder** : AI SDK is fully compatible with all APIs and usage methods of [ai-sdk.dev](https://ai-sdk.dev/) v5. The above examples only show basic usage. The only difference is in Provider acquisition - please use `eagle.extraModule.ai.getProviders()` to get configured AI providers. The system will automatically handle API Keys and related configurations, so developers don't need to worry about these details.
For more detailed usage methods and advanced features, please refer to the [AI SDK v5 Official Documentation](https://ai-sdk.dev/docs/ai-sdk-core/generating-text). Note that newer versions of AI SDK may have different APIs or features.


## AI Search

*Source: [https://developer.eagle.cool/plugin-api/extra-module/ai-search](https://developer.eagle.cool/plugin-api/extra-module/ai-search)*

# AI Search
Provides AI semantic search capabilities, including text search and image-based search.
> ⚠️ **Warning:**
**This feature is not yet released** : This feature requires Eagle 4.0 build18+ and the future "AI Search" plugin to be installed. Please follow the Eagle website for release updates.
* * *
Introduction to AI Search Plugin
"AI Search" is a plugin that provides AI semantic search capabilities, supporting text-based semantic search and image-based similarity search. By integrating this plugin, developers can easily implement powerful AI search functionality in their own plugins.
Key Features
  * **Text Semantic Search** - Search for related images using natural language descriptions
  * **Image-based Search** - Find similar images using an image
  * **Item ID Search** - Find similar images based on existing items


* * *
How to Use AI Search
Use `eagle.extraModule.aiSearch` to access the AI Search plugin functionality.
Status Queries
Before calling search methods, it's recommended to check the service status:
```
eagle.onPluginCreate(async (plugin) => {
    const aiSearch = eagle.extraModule.aiSearch;

    // Check if the plugin is installed
    const isInstalled = await aiSearch.isInstalled();
    console.log('Installed:', isInstalled);

    // Check if the service is ready
    const isReady = await aiSearch.isReady();
    console.log('Service Ready:', isReady);

    // Check if the service is starting
    const isStarting = await aiSearch.isStarting();
    console.log('Starting:', isStarting);

    // Check if data is syncing
    const isSyncing = await aiSearch.isSyncing();
    console.log('Syncing:', isSyncing);
});
```

Service Control
```
eagle.onPluginCreate(async (plugin) => {
    const aiSearch = eagle.extraModule.aiSearch;

    // Open AI Search plugin (will prompt installation if not installed)
    await aiSearch.open();

    // Check service health
    const isHealthy = await aiSearch.checkServiceHealth();
    console.log('Service Healthy:', isHealthy);

    // Get sync status details
    const syncStatus = await aiSearch.getSyncStatus();
    console.log('Sync Status:', syncStatus);
});
```

* * *
Search Methods
searchByText(query, options) - Text Semantic Search
Search for related images using natural language descriptions.
  * `query` string - Search keywords or description
  * `options` Object (optional) - Search options
    * `limit` number - Result count limit, default 20
  * Returns `Promise<Object>` - Search results
    * `results` Array - Array of search results
      * `item` Item - Complete Item object
      * `score` number - Similarity score


```
eagle.onPluginCreate(async (plugin) => {
    const aiSearch = eagle.extraModule.aiSearch;

    // Check if service is ready
    if (!await aiSearch.isReady()) {
        console.log('AI Search service is not ready');
        return;
    }

    // Text semantic search
    const result = await aiSearch.searchByText('an orange cat', {
        limit: 10
    });

    // Iterate through search results
    result.results.forEach(r => {
        console.log('Similarity:', r.score);
        console.log('File Name:', r.item.name);
        console.log('Tags:', r.item.tags);
    });
});
```

searchByBase64(base64, options) - Base64 Image Search
Search for similar images using a Base64 encoded image.
  * `base64` string - Base64 encoded image string
  * `options` Object (optional) - Search options
    * `limit` number - Result count limit, default 20
  * Returns `Promise<Object>` - Search results


```
eagle.onPluginCreate(async (plugin) => {
    const aiSearch = eagle.extraModule.aiSearch;

    // Search using Base64 image
    const base64Image = 'data:image/jpeg;base64,/9j/4AAQSkZJRg...';
    const result = await aiSearch.searchByBase64(base64Image, {
        limit: 20
    });

    console.log('Found', result.results.length, 'similar images');

    result.results.forEach(r => {
        console.log(`${r.item.name} - Similarity: ${(r.score * 100).toFixed(1)}%`);
    });
});
```

searchByItemId(itemId, options) - Search by Existing Item
Search for similar images using an existing Eagle item ID.
  * `itemId` string - Eagle item ID
  * `options` Object (optional) - Search options
    * `limit` number - Result count limit, default 20
  * Returns `Promise<Object>` - Search results


```
eagle.onPluginCreate(async (plugin) => {
    const aiSearch = eagle.extraModule.aiSearch;

    // Get currently selected items
    const selectedItems = await eagle.item.get({ isSelected: true });

    if (selectedItems.length === 0) {
        console.log('Please select an item first');
        return;
    }

    // Search for similar images using the selected item's ID
    const result = await aiSearch.searchByItemId(selectedItems[0].id, {
        limit: 30
    });

    console.log('Found', result.results.length, 'similar images');

    // The item in results is a complete Item object with all methods available
    for (const r of result.results) {
        console.log(`${r.item.name} (${r.item.ext}) - Similarity: ${r.score}`);

        // You can directly use Item methods
        // await r.item.save();
    }
});
```

* * *
Complete Example
Building a Similar Image Search Feature
```
eagle.onPluginCreate(async (plugin) => {
    const aiSearch = eagle.extraModule.aiSearch;

    // 1. Check service status
    if (!await aiSearch.isInstalled()) {
        // Open installation prompt
        await aiSearch.open();
        return;
    }

    if (!await aiSearch.isReady()) {
        console.log('Please wait for AI Search service to start');
        return;
    }

    // 2. Execute search
    try {
        const result = await aiSearch.searchByText('sunset beach scenery');

        if (result.results.length === 0) {
            console.log('No related images found');
            return;
        }

        // 3. Process search results
        const topResults = result.results
            .filter(r => r.score > 0.5)  // Keep only results with similarity > 50%
            .slice(0, 10);               // Take top 10

        console.log(`Found ${topResults.length} highly relevant images:`);

        topResults.forEach((r, index) => {
            console.log(`${index + 1}. ${r.item.name}`);
            console.log(`   Similarity: ${(r.score * 100).toFixed(1)}%`);
            console.log(`   Size: ${r.item.width} x ${r.item.height}`);
            console.log(`   Tags: ${r.item.tags.join(', ') || 'None'}`);
        });

        // 4. Further operations on these items
        // For example: select these items
        const itemIds = topResults.map(r => r.item.id);
        await eagle.item.select(itemIds);

    } catch (error) {
        console.error('Search failed:', error.message);
    }
});
```

* * *
API Reference
Status Query Methods
Method
Return Type
Description
`isInstalled()`
`Promise<boolean>`
Check if AI Search plugin is installed
`isReady()`
`Promise<boolean>`
Check if service is ready
`isStarting()`
`Promise<boolean>`
Check if service is starting
`isSyncing()`
`Promise<boolean>`
Check if data is syncing
Service Control Methods
Method
Return Type
Description
`open()`
`Promise<void>`
Open AI Search plugin
`checkServiceHealth()`
`Promise<boolean>`
Check service health status
`getSyncStatus()`
`Promise<Object>`
Get detailed sync status
Search Methods
Method
Return Type
Description
`searchByText(query, options?)`
`Promise<Object>`
Text semantic search
`searchByBase64(base64, options?)`
`Promise<Object>`
Base64 image search
`searchByItemId(itemId, options?)`
`Promise<Object>`
Search similar images by item ID
Search Result Format
```
{
    // ... other fields
    results: [
        {
            item: Item,    // Complete Item object with all properties and methods
            score: number  // Similarity score (0-1)
        },
        // ...
    ]
}
```

> ℹ️ **Info:**
**Tip** : The `item` in search results is a complete Item object instance. You can directly use methods like `save()`, `refreshThumbnail()`, and all other Item methods.


---

# 📋 Changelog


## Changelog

*Source: [https://developer.eagle.cool/plugin-api/changelog](https://developer.eagle.cool/plugin-api/changelog)*

# Changelog
Eagle Plugin API changelog, documenting all important feature changes since the first Plugin API version.
> ℹ️ **Info:**
Update: Eagle 4.0 Build12 has been officially released. Features marked "Eagle 4.0 Build12+" are now available. If you are on an older version, please upgrade to 4.0 build12 or later.
January 22, 2026
💻 App API Enhancement
**New Feature: Show Main Window (Eagle 4.0 build18+)**
> ⚠️ **Warning:**
**This feature is not yet released** : This feature requires Eagle 4.0 build18 or later. Please follow the Eagle website for release updates.
  * Added [`eagle.app.show()`](https://developer.eagle.cool/plugin-api/api/app#show) method, allowing plugins to bring the Eagle main application window to the front and display it on top


```
// Bring Eagle main window to the front
await eagle.app.show();
```

📄 Item API Enhancement
**New Feature: Modify Import Time (Eagle 4.0 build18+)**
> ⚠️ **Warning:**
**This feature is not yet released** : This feature requires Eagle 4.0 build18 or later. Please follow the Eagle website for release updates.
  * [`item.importedAt`](https://developer.eagle.cool/plugin-api/api/item#importedat-interger) property now supports modification, allowing plugins to customize file import time
  * Useful for batch importing historical files, data migration, and other scenarios requiring preservation of original timestamps


```
// Modify import time
item.importedAt = new Date('2024-01-01').getTime();
await item.save();
```

January 9, 2026
🔍 AI Search Semantic Search API
**New Feature: AI Semantic Search Integration (Eagle 4.0 build18+)**
> ⚠️ **Warning:**
**This feature is not yet released** : This feature requires the future "AI Search" plugin to be installed. Please follow the Eagle website for release updates.
  * Added [`eagle.extraModule.aiSearch`](https://developer.eagle.cool/plugin-api/extra-module/ai-search) module, providing AI semantic search capabilities
  * **Status Query Methods** :
    * `isInstalled()` - Check if AI Search plugin is installed
    * `isReady()` - Check if service is ready
    * `isStarting()` - Check if service is starting
    * `isSyncing()` - Check if data is syncing
  * **Service Control Methods** :
    * `open()` - Open AI Search plugin
    * `checkServiceHealth()` - Check service health status
    * `getSyncStatus()` - Get detailed sync status
  * **Search Methods** :
    * `searchByText(query, options)` - Text semantic search
    * `searchByBase64(base64, options)` - Base64 image search
    * `searchByItemId(itemId, options)` - Search similar images by item ID


```
const aiSearch = eagle.extraModule.aiSearch;

// Check service status
if (await aiSearch.isReady()) {
    // Text semantic search
    const result = await aiSearch.searchByText('an orange cat', { limit: 10 });

    // Results contain complete Item objects
    result.results.forEach(r => {
        console.log(`${r.item.name} - Similarity: ${(r.score * 100).toFixed(1)}%`);
    });
}
```

January 8, 2026
🏷️ TagGroup/Tag API Incremental Operations
**New Feature: Incremental Tag Group Operations (Eagle 4.0 build18+)**
  * [`tagGroup.addTags()`](https://developer.eagle.cool/plugin-api/api/tag-group#addtags) - Incrementally add or move tags to a group without passing the complete tags array
  * [`tagGroup.removeTags()`](https://developer.eagle.cool/plugin-api/api/tag-group#removetags) - Remove specified tags from a group
  * [`eagle.tag.merge()`](https://developer.eagle.cool/plugin-api/api/tag#merge) - Merge tags by renaming source tag to target tag


```
// Add tags to group
await tagGroup.addTags({ tags: ['UI', 'UX'] });

// Move tags (remove from original groups)
await tagGroup.addTags({ tags: ['Branding'], removeFromSource: true });

// Remove tags from group
await tagGroup.removeTags({ tags: ['Outdated'] });

// Merge tags
const result = await eagle.tag.merge({ source: 'UI Design', target: 'UI' });
```

🏷️ TagGroup API Enhancement
**New Feature: Tag Group Description Property (Eagle 4.0 build18+)**
  * Added `description` property to [`tagGroup`](https://developer.eagle.cool/plugin-api/api/tag-group), allowing you to add descriptive text to tag groups
  * Supported in both `create()` and `save()` methods


```
// Create a tag group with description
await eagle.tagGroup.create({
    name: "new group",
    description: "Group description"
});

// Modify tag group description
tagGroup.description = "New description";
await tagGroup.save();
```

January 6, 2026
🏷️ Tag API Enhancement
**New Feature: Get Starred Tags (Eagle 4.0 build18+)**
  * Added [`eagle.tag.getStarredTags()`](https://developer.eagle.cool/plugin-api/api/tag#starred) method to retrieve user's favorite/starred tags


```
const starred = await eagle.tag.getStarredTags();
```

**Documentation Fix**
  * Fixed incorrect API method name: `getRecents()` → [`getRecentTags()`](https://developer.eagle.cool/plugin-api/api/tag#dwsxw)


August 21, 2025
💻 App API Enhancement
**New Feature: app.userDataPath Property (Eagle 4.0 build12+)**
  * Added [`app.userDataPath`](https://developer.eagle.cool/plugin-api/api/app#ud9km) property, returns the path to the current user data directory
  * Provides quick access to Eagle's user data storage location


```
console.log(eagle.app.userDataPath);
// "C:\Users\User\AppData\Roaming\Eagle"
```

August 19, 2025
📁 Folder API Enhancements
**New Feature: Folder parent Property Modifiable (Eagle 4.0 build12+)**
  * Added [`folder.parent`](https://developer.eagle.cool/plugin-api/api/folder#woenk) property modification support, allowing dynamic adjustment of folder hierarchy
  * Support for moving folders to different parent directories or root directory


```
// Move to another parent folder
folder.parent = 'parent_folder_id';
await folder.save();

// Move to root directory  
folder.parent = null;
await folder.save();
```

**New Feature: Folder iconColor Property Modifiable (Eagle 4.0 build12+)**
  * Changed [`folder.iconColor`](https://developer.eagle.cool/plugin-api/api/folder#woenk) property from read-only to modifiable
  * Added [`eagle.folder.IconColor`](https://developer.eagle.cool/plugin-api/api/folder#static-properties) static constant object, providing predefined color options
  * Supported colors: Red, Orange, Yellow, Green, Aqua, Blue, Purple, Pink


```
folder.iconColor = eagle.folder.IconColor.Blue;
await folder.save();
```

August 13, 2025
🏷️ Tag API Feature Expansion
**New Feature: Tag Filtering and Tag Class Enhancement**
  * [`eagle.tag.get()`](https://developer.eagle.cool/plugin-api/api/tag#x9nu2) method added `name` parameter, supporting fuzzy search by tag name
  * Tag instance added [`save()`](https://developer.eagle.cool/plugin-api/api/tag#instance-methods) method, supporting tag name modification
  * Added Tag instance properties: [`name`](https://developer.eagle.cool/plugin-api/api/tag#instance-properties) (modifiable), `count`, `color`, `groups`, `pinyin`


```
// Filter tags
const filteredTags = await eagle.tag.get({ name: "design" });

// Modify tag name  
tag.name = 'new-name';
await tag.save();
```

⚠️ **Note: Modifying tag names will automatically update all files using that tag**
August 5, 2025
📄 Item API Performance and Selection Enhancements
**New Feature: Performance Optimization**
  * [`eagle.item.get()`](https://developer.eagle.cool/plugin-api/api/item#bdcw2) added `fields` parameter, supporting selective field return for significant query performance improvement
  * Added [`eagle.item.getIdsWithModifiedAt()`](https://developer.eagle.cool/plugin-api/api/item#getidswithmodifiedat) method, optimized for incremental synchronization
  * Added [`modifiedAt`](https://developer.eagle.cool/plugin-api/api/item#woenk) property, recording file last modification time


```
// Return only needed fields
let items = await eagle.item.get({
    tags: ["Design"],
    fields: ["id", "name", "tags", "modifiedAt"]
});

// Efficient incremental sync
let fileInfo = await eagle.item.getIdsWithModifiedAt();
```

**New Feature: Counting and Selection Methods**
  * Added [`eagle.item.count(options)`](https://developer.eagle.cool/plugin-api/api/item#count) - conditional counting
  * Added [`eagle.item.countAll()`](https://developer.eagle.cool/plugin-api/api/item#countall) - total file count
  * Added [`eagle.item.countSelected()`](https://developer.eagle.cool/plugin-api/api/item#countselected) - selected file count
  * Added [`eagle.item.select(itemIds)`](https://developer.eagle.cool/plugin-api/api/item#select) - programmatic file selection


```
let count = await eagle.item.count({ isSelected: true });
await eagle.item.select(['ITEM_ID_1', 'ITEM_ID_2']);
```

**Enhanced Feature: open() Method**
  * [`eagle.item.open()`](https://developer.eagle.cool/plugin-api/api/item#yxkul) added `window` option, supporting opening files in new window


```
await eagle.item.open('item_id', { window: true });
```

July 31, 2025
🪟 Window API Expansion
**New Feature: Window Geometry Control**
  * Added [`eagle.window.getSize()`](https://developer.eagle.cool/plugin-api/api/window#mq0dz) - get window size
  * Added [`eagle.window.setBounds(bounds)`](https://developer.eagle.cool/plugin-api/api/window#setbounds-bounds) - set window bounds (position + size)
  * Added [`eagle.window.getBounds()`](https://developer.eagle.cool/plugin-api/api/window#getbounds) - get window bounds information


```
await eagle.window.getSize();
await eagle.window.setBounds({ x: 440, y: 225, width: 800, height: 600 });
await eagle.window.getBounds();
```

November 28, 2024
🏷️ TagGroup CRUD Operations
**New Feature: Complete Tag Group Management**
  * Added [`eagle.tagGroup.create(options)`](https://developer.eagle.cool/plugin-api/api/tag-group#x9nu2) - create new tag group
  * Added [`tagGroup.save()`](https://developer.eagle.cool/plugin-api/api/tag-group#x9nu2) - save modifications
  * Added [`tagGroup.remove()`](https://developer.eagle.cool/plugin-api/api/tag-group#x9nu2) - delete tag group


```
// Create tag group
await eagle.tagGroup.create({
    name: "new group",
    color: "red", 
    tags: ["tag1", "tag2"]
});

// Modify and save
tagGroup.name = "new name";
await tagGroup.save();

// Delete group
await tagGroup.remove();
```

🗑️ Item Deletion Feature
**New Feature: File Trash Operations**
  * Added [`item.moveToTrash()`](https://developer.eagle.cool/plugin-api/api/item#movetotrash) instance method, moving files to system trash


```
let item = await eagle.item.getById('item_id');
await item.moveToTrash();
```

July 25, 2024
🪟 Window API Enhancement
**New Feature: HTTP Referer Setting**
  * Added [`eagle.window.setReferer(url)`](https://developer.eagle.cool/plugin-api/api/window#4a6f) method, setting referer header for subsequent network requests


```
eagle.window.setReferer("https://example.com");
```

May 10, 2024
🖱️ Context Menu API
**New Feature: Custom Context Menu**
  * Added [`eagle.contextMenu.open()`](https://developer.eagle.cool/plugin-api/api/context-menu#tkp0d) method, supporting custom context menus
  * Support for multi-level submenus, custom click events, system native styling


```
eagle.contextMenu.open([
    {
        id: "edit",
        label: "Edit",
        submenu: [...],
        click: () => { ... }
    }
]);
```

🪟 Window API Screenshot Feature
**New Feature: Page Screenshot**
  * Added [`eagle.window.capturePage(rect)`](https://developer.eagle.cool/plugin-api/api/window#yvfx9) method, supporting full page or specified area screenshots
  * Returns NativeImage object, convertible to base64 or PNG buffer


```
// Full page screenshot
const image = await eagle.window.capturePage();

// Specified area screenshot
const image2 = await eagle.window.capturePage({ 
    x: 0, y: 0, width: 100, height: 50 
});
```

April 17, 2024
🔍 Preview Plugin Feature Enhancement
**New Feature: Zoom Control Parameter**
  * Preview plugin configuration added [`allowZoom`](https://developer.eagle.cool/plugin-api/get-started/plugin-types/preview) parameter, controlling whether users can zoom preview content


```
"thumbnail": {
    "path": "thumbnail/icns.js",
    "size": 400,
    "allowZoom": false
}
```


---


*📝 This documentation was automatically generated from [developer.eagle.cool/plugin-api](https://developer.eagle.cool/plugin-api/)*
