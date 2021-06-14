# PuAc TW Project

Simple project using HTML5, CSS3, Javascript.

# Folder Structure
**/** 
	The root of dir, where you will find the index.html
**/assets** 
  Having all the CSS and JS files
**/images** 
	All images used for website
**/views** 
	Here you will find every .html page for each flow of the page.
	1. My Items (Achizitiile mele)
	2. All Items(Toate Achizitiile)
	3. Single Item

## Run project
**Method 1 (used by me)**
Open project using **vscode**.
Install **Live Server** Plugin.
Right Click on index.html and run **Open with live server**

The server will be opened at **http://localhost:5500/index.html**

**Method 2 (hard way)**
Simply open index.html on web browser.
**ERROR** The routing for pages from /views folder especially on single item will not work.

You need to change the href 
from **file:///views/item.html?id=609fb4796db51bde50d0f90c**
to **file:///home/your-project-folder/views/item.html?id=609fb4796db51bde50d0f90c**