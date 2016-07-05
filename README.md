# CodeCampKit

CodeCamp Kit is a module that is designed to get your workshop up and going quickly and with a well documented review process.

## Getting Started

```
mkdir mycodecamp
npm install json -g
npm init
npm install codecampkit -S
json -I -f package.json -e 'this.scripts.start = "cck"'
touch README.md
```

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

CCK is agnostic to how you build your demo's and exercises, but a great way is the tonicdev embedded nodejs system, it enables you to run nodejs and npm modules right from your markdown pages.  See the [How To](/howto.md) page for more info.

## Projects

## FAQ

## Development Deploy

```
npm run build
npm version patch
git push origin master --tags
npm publish
```
