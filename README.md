#working with csv files..

1.for file uploadation and storing on server used multer library.
2.At first take user input file (from frontend) and on post request
(and using multer library file stored on server ) and also stored filename on database(for databse mongodb has been used).

3.after storing user csv files,on get request ,we fetch the filename from databse,send it on frontend side and stored in html list in browser.
4.on click event on any files in html list(on frontend side),
we call an api which reads the clicked csv file and send its data on frontend side.
Then binded json data in  html tables and shown it to user.

5.implemented search functionality on column to search any data
6.implemented sorting on each column to sort data by both ascending order or descending order.
7.implemented pagination to show records 100 per page in frontend side
8.implemnted charts using google charting library  to show  column data when user clicked on any particular column of html table

