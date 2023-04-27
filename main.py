import os
import argparse
import base64
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
    
def build_google_services(path_to_token=None, path_to_creds=None):
    """
    Builds necessary Google API services for Google Drive and Gmail.

    Returns:
        drive_service: Google Drive API service
        gmail_service: Gmail API service
    """

    scopes = ['https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/gmail.compose']
    try:
        if path_to_token:
            creds = Credentials.from_authorized_user_file(path_to_token, scopes=scopes)
        else:
            flow = InstalledAppFlow.from_client_secrets_file(path_to_creds, scopes=scopes)
            creds = flow.run_local_server(port=0)
            with open('token.json', 'w') as token:
                token.write(creds.to_json())

        # Build Google Drive API service
        drive_service = build('drive', 'v3', credentials=creds)

        # Build Gmail API service
        gmail_service = build('gmail', 'v1', credentials=creds)

        print('Successfully built Google Drive and Gmail API services.')
        return drive_service, gmail_service

    except Exception as error:
        print(f'Error building Google Drive and Gmail API services: {error}')
        return None, None
    
def upload_zip_to_drive(drive_service, zip_file_path, folder_id):
    """
    Uploads a zip file to Google Drive.

    Args:
        drive_service (googleapiclient.discovery.Resource): Google Drive API service
        zip_file_path (str): Path to the zip file to be uploaded
        folder_id (str): ID of the Google Drive folder where the file should be uploaded

    Returns:
        file_id (str): ID of the uploaded file
    """
    try:
        # Create file metadata
        file_metadata = {'name': os.path.basename(zip_file_path),
                         'parents': [folder_id],
                         'mimeType': 'application/zip'}

        # Upload file to Google Drive
        media = MediaFileUpload(zip_file_path, mimetype='application/zip', resumable=True)
        file = drive_service.files().create(body=file_metadata, media_body=media, fields='id,webViewLink').execute()
        file_id = file.get('id')
        file_link = file.get('webViewLink')

        print(f'Successfully uploaded zip file to Google Drive with file ID: {file_id}')
        return file_id, file_link

    except HttpError as error:
        print(f'Error uploading zip file to Google Drive: {error}')
        return None, None
    
def change_file_access_link(drive_service, file_id):
    """
    Change the access link of a file in Google Drive to allow anyone with the link to access it.

    Args:
        drive_service (googleapiclient.discovery.Resource): Google Drive API service.
        file_id (str): ID of the file whose access link needs to be changed.

    Returns:
        bool: Success boolean (True if permissions changed).
    """
    try:
        # Define the permission body to update the access link
        permission_body = {
            'role': 'reader',
            'type': 'anyone',
            'allowFileDiscovery': False,
            'sendNotificationEmail': False,
            'supportsAllDrives': True
        }

        # Update the file permission
        permission = drive_service.permissions().create(
            fileId=file_id,
            body=permission_body,
            fields='kind,id'
        ).execute()
        print(f'Permission for file {file_id} has been updated.')
        return True

    except HttpError as error:
        print(f'Error changing file permissions: {error}')
        return False

def send_scheduled_email(gmail_service, recipient, subject, body, file_link):
    """
    Sends an email with scheduled send at a specific time using the Gmail API.

    Args:
        gmail_service (googleapiclient.discovery.Resource): Gmail API service.
        recipient (str): Recipient email address.
        subject (str): Subject of the email.
        body (str): Body of the email.
        file_link (str): Access link of the file.

    Returns:
        None
    """
    try:
        message = MIMEMultipart()
        message['to'] = recipient
        message['subject'] = subject

        # Add file link to the email
        link = MIMEText(file_link, 'plain')
        message.attach(link)

        # Add body to the email
        body_text = MIMEText(body, 'plain')
        message.attach(body_text)

        # Convert the email message to base64
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')

        # Create the scheduled send request
        request = {
            'raw': raw_message,
        }

        # Send the email with scheduled send
        response = gmail_service.users().messages().send(
            userId='me',
            body=request
        ).execute()
        print(f'Email sent to {recipient} with message Id: {response["id"]}')

    except HttpError as error:
        print(f'An error occurred: {error}')
  
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('zip_file', type=str, help='Zip file name. Zip file must be in Versions folder')
    parser.add_argument('subject', type=str, help='Email subject')
    parser.add_argument('notes', type=str, help='Additional notes to be included in the email')
    args = parser.parse_args()

    # check if theres a token file
    token = 'token.json'
    if not os.path.isfile(token):
        token = None

    # check if theres a credential file
    creds = 'credentials_oauth.json'
    if not os.path.isfile(creds):
        creds = None

    if creds or token:
        # build services
        drive, gmail = build_google_services(path_to_token=token, path_to_creds=creds)

        if drive and gmail:
            # prepping upload
            filePath = f'Versions\\{args.zip_file}'
            folder_id = '1oIt5hBUxLGfTrPvvm4T8YfSTv0fP3rtL' # @ PPJ Versions folder id

            # upload zip file
            file_id, link = upload_zip_to_drive(drive, filePath, folder_id)

            if file_id and link:
                # change file access
                access = change_file_access_link(drive, file_id)

                if access:
                    # prepping email
                    recipient = 'hidayah@hyperanalytics.biz' # @ Puan Hidayah's email
                    subject = args.subject
                    body = f'\n\nChanges:\n{args.notes}'

                    # send email
                    send_scheduled_email(gmail, recipient, subject, body, link)
    else:
        print('Neither token nor credentials are found.')

if __name__ == "__main__":
    main()