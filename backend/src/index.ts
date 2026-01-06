import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';

import { env, validateEnv } from './config';
import { createSchema } from './graphql/schema';
import { buildContext, disconnectPrisma, Context } from './graphql/context';

// Validate environment variables
validateEnv();

async function startServer() {
  // Create Express app
  const app = express();

  // Create HTTP server
  const httpServer = http.createServer(app);

  // Create GraphQL schema
  const schema = createSchema();

  // Create Apollo Server
  const server = new ApolloServer<Context>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          console.log(`🚀 ${env.productName} GraphQL Server starting...`);
        },
      },
    ],
    formatError: (formattedError, error) => {
      // Log errors in development
      if (env.isDevelopment) {
        console.error('GraphQL Error:', error);
      }

      // Don't expose internal errors in production
      if (env.isProduction && !formattedError.extensions?.code) {
        return {
          message: 'Internal server error',
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        };
      }

      return formattedError;
    },
    introspection: env.isDevelopment,
  });

  // Start Apollo Server
  await server.start();

  // Apply middleware
  app.use(
    helmet({
      contentSecurityPolicy: env.isProduction ? undefined : false,
      crossOriginEmbedderPolicy: false,
    })
  );

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    })
  );

  app.use(morgan(env.isDevelopment ? 'dev' : 'combined'));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: env.productName,
    });
  });

  // GraphQL endpoint
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => buildContext({ req, res }),
    })
  );

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.url} not found`,
    });
  });

  // Error handler
  app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Server Error:', err);

    res.status(500).json({
      error: 'Internal Server Error',
      message: env.isDevelopment ? err.message : 'An unexpected error occurred',
    });
  });

  // Start HTTP server
  await new Promise<void>((resolve) => {
    httpServer.listen({ port: env.port }, resolve);
  });

  console.log('');
  console.log('='.repeat(60));
  console.log(`🚀 ${env.productName} Server Ready!`);
  console.log('='.repeat(60));
  console.log(`📍 GraphQL:    http://localhost:${env.port}/graphql`);
  console.log(`📍 Health:     http://localhost:${env.port}/health`);
  console.log(`🌍 Environment: ${env.nodeEnv}`);
  console.log('='.repeat(60));
  console.log('');

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);

    await server.stop();
    await disconnectPrisma();

    httpServer.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
