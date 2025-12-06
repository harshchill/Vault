# Admin Upload Page Documentation

## Overview

The Admin Upload Page (`app/admin/page.js`) is a client-side React component that allows administrators to upload exam papers to the Vault system. It handles file uploads to Supabase storage and saves paper metadata to MongoDB.

## Features

- ✅ **PDF File Upload**: Secure upload of PDF files to Supabase storage
- ✅ **Form Validation**: Client-side validation for all form fields
- ✅ **Error Handling**: Comprehensive error messages for user feedback
- ✅ **Loading States**: Visual feedback during upload process
- ✅ **Database Integration**: Automatic saving of paper metadata to MongoDB
- ✅ **File Size Validation**: Maximum file size limit of 10MB
- ✅ **File Type Validation**: Only PDF files are accepted

## Prerequisites

### Environment Variables

The following environment variables must be set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
MONGODB_URI=your_mongodb_connection_string
```

### Supabase Setup

1. **Create a Storage Bucket**:
   - Go to your Supabase project dashboard
   - Navigate to Storage
   - Create a new bucket named `Vault`
   - Set the bucket to **Public** (or configure appropriate policies)

2. **Storage Policies** (Recommended):
   - Allow authenticated users to upload files
   - Allow public read access to files

### MongoDB Setup

Ensure your MongoDB connection is properly configured in `db/connectDb.js` and that the database is accessible.

## File Structure

```
app/
├── admin/
│   ├── page.js          # Main admin upload component
│   └── README.md        # This documentation file
├── api/
│   └── papers/
│       └── route.js     # API endpoint for paper CRUD operations
└── ...
```

## Component Architecture

### State Management

The component uses React hooks for state management:

- `loading`: Boolean indicating upload in progress
- `supabase`: Supabase client instance
- `formData`: Object containing form field values
  - `title`: Paper title
  - `subject`: Subject code (e.g., CS101)
  - `semester`: Semester number (1-8)
  - `year`: Year of the exam
- `file`: Selected PDF file object
- `error`: Error message string (null if no error)
- `success`: Success message string (null if no success)

### Key Functions

#### `handleChange(e)`
Handles changes to form input fields and updates the `formData` state.

#### `handleFileChange(e)`
Validates and sets the selected PDF file:
- Validates file type (must be PDF)
- Validates file size (max 10MB)
- Sets error state if validation fails

#### `parseSemester(semesterStr)`
Converts semester string to number format required by the database.
- Handles formats: "1", "1st Sem", "Semester 1", etc.
- Returns a number between 1-8

#### `handleUpload(e)`
Main upload handler that:
1. Validates form data and file
2. Uploads file to Supabase storage
3. Gets public URL from Supabase
4. Saves paper metadata to MongoDB via API

## API Integration

### POST `/api/papers`

The component sends a POST request to save paper metadata:

**Request Body:**
```json
{
  "title": "Data Structures Mid-Term",
  "subject": "CS101",
  "semester": 1,
  "year": 2024,
  "url": "https://supabase.co/storage/v1/object/public/Vault/..."
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Paper created successfully",
  "paper": {
    "id": "...",
    "title": "Data Structures Mid-Term",
    "subject": "CS101",
    "semester": 1,
    "year": 2024,
    "url": "https://...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400/500):**
```json
{
  "error": "Error message description"
}
```

## Usage

### Basic Usage

1. Navigate to `/admin` in your application
2. Fill in the form fields:
   - **Paper Title**: Descriptive title of the exam paper
   - **Subject Code**: Course/subject identifier (e.g., CS101)
   - **Year**: Year the exam was conducted
   - **Semester**: Select from dropdown (1-8)
3. Select a PDF file (max 10MB)
4. Click "Upload Paper"
5. Wait for success confirmation

### Form Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Title | Text | Yes | Name/title of the exam paper |
| Subject | Text | Yes | Subject or course code |
| Year | Number | Yes | Year of the exam (2000-2100) |
| Semester | Select | Yes | Semester number (1-8) |
| File | File | Yes | PDF file to upload (max 10MB) |

## Error Handling

The component handles various error scenarios:

1. **Missing Environment Variables**: Shows error if Supabase config is missing
2. **Invalid File Type**: Validates PDF file type
3. **File Size Exceeded**: Validates 10MB limit
4. **Upload Failures**: Catches and displays Supabase upload errors
5. **API Errors**: Displays database save errors
6. **Network Errors**: Handles fetch failures gracefully

## Upload Flow

```
User submits form
    ↓
Validate form data & file
    ↓
Upload file to Supabase Storage
    ↓
Get public URL from Supabase
    ↓
Save metadata to MongoDB via API
    ↓
Display success message & reset form
```

## Database Schema

The paper data is saved to MongoDB using the `Paper` model:

```javascript
{
  title: String (required),
  subject: String (required),
  semester: Number (required, 1-8),
  year: Number (required),
  url: String (required), // Supabase public URL
  createdAt: Date (auto-generated)
}
```

## Styling

The component uses Tailwind CSS for styling:
- Responsive design with mobile support
- Modern UI with indigo color scheme
- Loading spinner animation
- Error/success message styling
- Disabled state styling during upload

## Troubleshooting

### Common Issues

1. **"Supabase configuration missing"**
   - Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
   - Restart the development server after adding environment variables

2. **"Supabase upload failed"**
   - Verify the `Vault` bucket exists in Supabase
   - Check bucket permissions and policies
   - Ensure the bucket is set to public or has proper access policies

3. **"Failed to save paper to database"**
   - Check MongoDB connection
   - Verify the API endpoint `/api/papers` is accessible
   - Check server logs for detailed error messages

4. **File upload not working**
   - Verify file is PDF format
   - Check file size is under 10MB
   - Ensure Supabase storage bucket is properly configured

## Security Considerations

- File uploads are validated on the client side (also validate on server side in production)
- Supabase storage bucket should have appropriate access policies
- Consider adding authentication/authorization to restrict admin access
- Validate all inputs on the server side API endpoint
- Consider rate limiting for upload endpoints

## Future Enhancements

Potential improvements:
- [ ] Add authentication/authorization check
- [ ] Support for multiple file uploads
- [ ] Image preview for uploaded files
- [ ] Progress bar for file upload
- [ ] Drag and drop file upload
- [ ] File metadata extraction (page count, etc.)
- [ ] Bulk upload functionality
- [ ] Upload history/logs

## Related Files

- `app/api/papers/route.js` - API endpoint for paper operations
- `models/paper.js` - MongoDB schema for Paper model
- `db/connectDb.js` - MongoDB connection configuration

## Support

For issues or questions:
1. Check the error messages displayed on the page
2. Review browser console for detailed error logs
3. Check server logs for API errors
4. Verify all environment variables are correctly set

