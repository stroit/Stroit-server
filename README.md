<p style="text-align: center">
  <img src="http://i.imgur.com/VMQMa3d.png" width="250px" />
</p>

##Inspiration
Our idea started at MHacks 8 where, despite all odds, our members from University of Waterloo and Plainwell High School met and teamed up to create a simple, functional product that helped users find the safest route from one place in Detroit to another. Filled with bugs and weird performance issues, our team decided to continue the project and over 2 months, we finally developed our finished project - stroit.life.

##What it works
By taking statistical crime data and mapping it into areas throughout Detroit, we provide users with a service that helps them find the safest walking path from one location in Detroit to another.

##Todo
We definitely need to look for some optimizations in our path-determining algorithms. The run-time is too inconsistent depending on which locations the users pick. We also want to add a feature that helps user interpret and understand the data that we are working with - something that allows our users to break down the data and get to the crux of what they are looking at.

#RUN SERVER
`yarn start`

#BUILD SERVER
`yarn run build`

#IF NODE_ENV doesn't work
`export NODE_ENV=production'`
