# CodeCampKit

CodeCamp Kit is a markdown web server, that is designed to enable you to author documentation and training materials using markdown as your content and your file structure as your endpoints.

CodeCamp Kit works like a single page application, but it serves markdown files instead of html files and uses the github markdown styles for each file.

## Features

* JSBin Embedded Integration - https://jsbin.com
* RunKit Integration - https://runkit.com

* Setting the Web Title using a package.json file
* Setting the meta description using a description in the package.json file
* `index.md` is the default root file of every folder in your project.
* header.md will be injected as a header for every file.
* footer.md will be injected as a footer for every file.
* `css/style.css` is optional to add custom styles


## Getting Started

```
mkdir mycodecamp
npm install json -g
npm init
npm install codecampkit -S
json -I -f package.json -e 'this.scripts.start = "cck"'
echo "# CodeCamp Kit Rocks!" >> index.md
npm start
```

## Why?

We wanted to create a process that removed some unneeded decisions about documentation and training materials.

- How do students access the content?
- How do teachers teach the content?
- How can we use existing tools and platforms to make the content interactive?

Github is a great platform and git is a great version control system, managing content in a way that the content can exist in one location and distributed in a consumable way to several devices, the solution stack of git + responsive web is a solid choice. Markdown is a great way to write content, because you can mix both Markdown and HTML in the same file, this enables the ability to embed tools inside your content to create an immersive experience.

## Markdown All the things

The codecampkit module focuses on markdown as its main source of content, using markdown will enables you to collaborate well with others and focus on content and exercises.  The codecampkit is not necessarily for self-learning, but more focused for instructor lead classes.

## Structure

- index.md
- 1-lesson
  - index.md
  - demo.md
  - 1.md
  - 2.md
- 2-lesson
  - index.md
  - demo.md
  - 1.md
  - 2.md

Every folder is a lesson and in each lesson there are a index, demo, and one or more exercises.

## Links

```
- [Intro](/intro)
- [Lesson 1](/lesson1)
  - [Demo](/lesson1/demo)
  - [Ex1](/lesson1/1)
```

## Embedded Demos and Exercises

CCK is agnostic to how you build your demo's and exercises, but a great way is the runkit embedded nodejs system, it enables you to run nodejs and npm modules right from your markdown pages.  See the [How To](/howto.md) page for more info.

## Projects

* http://kids.chscodecamp.com
* http://exercises.how2js.com
* http://git.how2js.com
* http://mysql.how2js.com

## FAQ

* Can I serve as a static site?

With some shell commands it should be possible:

```
mkdir -p 'dist/'
mkdir -p 'dist/js'
mkdir -p 'dist/css'
curl 'localhost:3000' > 'dist/index.html'
curl 'localhost:3000/js/bundle.js' > 'dist/js/bundle.js'
curl 'localhost:3000/css/style.css' > 'dist/css/style.css'
cp **/*.md > dist
```

## CodeCampKit Repo Owner Deployment Instructions

> If you want to contribute a change and publish the change to codecampkit, here are the instructions.

```
npm run build
npm version patch
git push origin master --tags
npm publish
```
