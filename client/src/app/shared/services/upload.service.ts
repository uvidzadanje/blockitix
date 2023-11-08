import { Injectable } from '@angular/core';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private client: IPFSHTTPClient;

  constructor()
  {
    this.client = create({url: environment.ipfsServiceURL});
  }

  async upload(file: any)
  {
    const { cid } = await this.client.add(file);

    return cid;
  }
}
