# How to create a lesson?

A lesson should consist of a `README.md` file, `demo.md` file and 1 to many
exercise files, named `1.md`, `2.md` etc

The `README` file should contain the lesson contents with links to the demo file
and the exercises. The purpose of the lesson process is to communicate the concept and then demo the concept, then enable the class to work through the exercises, finally
work through the exercises together.


The readme file should include a footer that provides links to the home page, previous lesson and next lesson.

```
[Home](/) | [Prev](/lesson-1) | [Next](/lesson-3)
```

### Creating Exercises

To create exercises using TonicDev, include the following script tag

```
<script src="https://embed.tonicdev.com" data-element-id="[code]"></script>
```

And then add the div with id that will contain the code:

```
<div id="code">
  console.log('Hello World')
</div>
```

### Testing Code

Using twilson63/tpp is a easy testing library that has two functions.

- ok (bool, comment)
- equals (a, b, comment)

It may have more in the future, but you can include it in your code script by using a require statement.

```
const { ok, equals } = require("notebook")("twilson63/tpp/1.0.1")
```

### Questions

[TODO: Add your questions here]
