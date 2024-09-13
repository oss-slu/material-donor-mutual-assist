import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

// import indexRouter from './routes/index';
// import usersRouter from './routes/users';
// import donorsListRouter from './routes/donor-details/donorsList';
// import donorModuleRouter from './routes/demo/donorModule';
// import submitFormRouter from './routes/demo/submitForm';
// import emailRouter from './routes/email-service/emailService';
// import adminRouter from './routes/adminRoutes';
import donorRouter from './routes/donorRoutes';

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/donorsList', donorsListRouter);
// app.use('/donor-module', donorModuleRouter);
// app.use('/email-service', emailRouter);
// app.use('/submit-form', submitFormRouter);
// app.use('/admin', adminRouter);
app.use('/donor', donorRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 5000; // Use environment variable or default to 3001
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
