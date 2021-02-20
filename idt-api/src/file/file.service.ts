import { Injectable, Logger } from '@nestjs/common';
import { MongoGridFS, IGridFSWriteOption, IGridFSObject } from 'mongo-gridfs';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { GridFSBucketReadStream, Repository, DeepPartial, FindManyOptions, MoreThan, ObjectID } from 'typeorm';
import { DiskFile } from 'multer';
import { Stream, Duplex } from 'stream';
import * as uuid from 'uuid/v4';
import * as moment from 'moment';
import { File } from './model/file.entity';
import { createReadStream, fstat, ReadStream } from 'fs';
import { join } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './../user/model/user.entity';

@Injectable()
export class FileService {
    private fileModel: MongoGridFS;

    constructor(
        @InjectConnection()
        private readonly connection: Connection,

        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,

        @InjectModel('File') private readonly fileModelMongoose: Model<File>,

    ) {
        this.fileModel = new MongoGridFS(this.connection.db, 'files');
    }

    public async readStreamFromFS(relativePath: string): Promise<ReadStream> {
        return await createReadStream(join(__dirname, relativePath));
    }

    public async readStream(id: string): Promise<GridFSBucketReadStream> {
        return await this.fileModel.readFileStream(id);
    }

    public async deleteFile(id: string): Promise<any> {
      const res = await this.fileModel.delete(id);
      return res;
    }
    
    public async writeFile(file: DiskFile, user: User): Promise<File> {
        return new Promise<File>((resolve, reject) => {
            // Create stream from file
            const stream = new Duplex();
            stream.push(file.buffer);
            stream.push(null);

            const fileGuid = uuid();

            // Create options object
            const options: IGridFSWriteOption = {
                filename: `${fileGuid}.${(file.originalname as string).split('.').reverse()[0]}`,
            }

            this.fileModel.writeFileStream(stream, options).then((i) => {
                let attributes: DeepPartial<File> = {
                    fileId: i._id,
                    contentType: file.mimetype,
                    filename: i.filename,
                    length: i.length,
                    uploadedBy: user.id
                };

                let fileinfo = Object.assign(new File(), attributes);
                this.fileRepository.save(fileinfo).then((f) => {
                    resolve(f);
                }, (err) => {
                    reject(err);
                });
            }, (err) => {
                reject(err);
            });
        });
    }

    async count(range?: string): Promise<number> {
        let findQuery: FindManyOptions<File> = {};
    
        if (range === 'week') {
          findQuery = {
            where: {
              disabled: false,
              createdAt: MoreThan(moment().subtract(7, "days").startOf("day").toISOString())
            }
          }
        } else {
          findQuery = {
            where: {
              disabled: false,
            }
          }
        }
    
        return await this.fileRepository.count(findQuery);
      }
}
