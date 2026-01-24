import { Controller, Get } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private connection: Connection) {}

  @Get()
  async checkHealth() {
    try {
      // Test MongoDB connection
      const isConnected = this.connection.readyState === 1;
      
      if (isConnected) {
        // Run a ping command to verify connection
        const result = await this.connection.db.admin().ping();
        return {
          status: 'ok',
          timestamp: new Date(),
          mongodb: {
            connected: true,
            message: 'MongoDB connection successful',
            ping: result,
          },
        };
      }
      
      return {
        status: 'error',
        timestamp: new Date(),
        mongodb: {
          connected: false,
          message: 'MongoDB not connected',
          readyState: this.connection.readyState,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date(),
        mongodb: {
          connected: false,
          message: error.message,
          error: error.toString(),
        },
      };
    }
  }
}
