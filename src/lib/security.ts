/**
 * Frontend Security Utilities for Gold IRA Analysis
 * 
 * Provides client-side security measures for the analysis interface
 */

export class FrontendSecurity {
  // Content Security Policy helpers
  static readonly ALLOWED_FILE_TYPES = [
    'text/plain',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ] as const;
  
  static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  static readonly MAX_TRANSCRIPT_LENGTH = 100000; // 100K characters
  
  /**
   * Validate file upload before processing
   */
  static validateFileUpload(file: File): {
    valid: boolean;
    error?: string;
  } {
    // Check file type
    if (!this.ALLOWED_FILE_TYPES.includes(file.type as any)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${this.ALLOWED_FILE_TYPES.join(', ')}`
      };
    }
    
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File too large. Maximum size: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
      };
    }
    
    // Check filename for path traversal
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      return {
        valid: false,
        error: 'Invalid filename. Filenames cannot contain path separators.'
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Sanitize user input text
   */
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string');
    }
    
    // Basic HTML/script removal (additional server-side sanitization)
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
  
  /**
   * Validate transcript content
   */
  static validateTranscript(transcript: string): {
    valid: boolean;
    error?: string;
  } {
    if (!transcript || transcript.trim().length === 0) {
      return {
        valid: false,
        error: 'Transcript cannot be empty'
      };
    }
    
    if (transcript.length > this.MAX_TRANSCRIPT_LENGTH) {
      return {
        valid: false,
        error: `Transcript too long. Maximum length: ${this.MAX_TRANSCRIPT_LENGTH} characters`
      };
    }
    
    // Check for minimum meaningful content
    const wordCount = transcript.trim().split(/\s+/).length;
    if (wordCount < 50) {
      return {
        valid: false,
        error: 'Transcript appears too short for meaningful analysis (minimum 50 words)'
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Generate secure session identifier for frontend tracking
   */
  static generateSessionId(): string {
    // Use crypto.getRandomValues for secure random generation
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      // Fallback for environments without crypto
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    
    // Convert to hex string
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  /**
   * Rate limiting helper for client-side requests
   */
  static createRateLimiter(maxRequests: number, windowMs: number) {
    const requests: number[] = [];
    
    return {
      checkLimit(): { allowed: boolean; resetTime?: number } {
        const now = Date.now();
        const windowStart = now - windowMs;
        
        // Remove old requests outside the window
        while (requests.length > 0 && requests[0] < windowStart) {
          requests.shift();
        }
        
        // Check if we're at the limit
        if (requests.length >= maxRequests) {
          const resetTime = requests[0] + windowMs;
          return { allowed: false, resetTime };
        }
        
        // Add current request
        requests.push(now);
        return { allowed: true };
      },
      
      getRemaining(): number {
        const now = Date.now();
        const windowStart = now - windowMs;
        
        // Count requests in current window
        const currentRequests = requests.filter(time => time >= windowStart).length;
        return Math.max(0, maxRequests - currentRequests);
      }
    };
  }
  
  /**
   * Secure local storage helper
   */
  static secureStorage = {
    set(key: string, value: any, expirationMs?: number): void {
      const data = {
        value,
        timestamp: Date.now(),
        expiration: expirationMs ? Date.now() + expirationMs : null
      };
      
      try {
        localStorage.setItem(`goldira_${key}`, JSON.stringify(data));
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
    },
    
    get<T>(key: string): T | null {
      try {
        const item = localStorage.getItem(`goldira_${key}`);
        if (!item) return null;
        
        const data = JSON.parse(item);
        
        // Check expiration
        if (data.expiration && Date.now() > data.expiration) {
          localStorage.removeItem(`goldira_${key}`);
          return null;
        }
        
        return data.value;
      } catch (error) {
        console.warn('Failed to read from localStorage:', error);
        return null;
      }
    },
    
    remove(key: string): void {
      try {
        localStorage.removeItem(`goldira_${key}`);
      } catch (error) {
        console.warn('Failed to remove from localStorage:', error);
      }
    },
    
    clear(): void {
      try {
        // Remove all goldira-prefixed items
        const keys = Object.keys(localStorage).filter(key => key.startsWith('goldira_'));
        keys.forEach(key => localStorage.removeItem(key));
      } catch (error) {
        console.warn('Failed to clear localStorage:', error);
      }
    }
  };
  
  /**
   * Content Security Policy violations handler
   */
  static handleCSPViolation(event: SecurityPolicyViolationEvent): void {
    console.warn('CSP Violation:', {
      blockedURI: event.blockedURI,
      violatedDirective: event.violatedDirective,
      originalPolicy: event.originalPolicy,
      sourceFile: event.sourceFile,
      lineNumber: event.lineNumber
    });
    
    // In production, report to security monitoring
    // reportSecurityEvent('csp_violation', event);
  }
  
  /**
   * Initialize client-side security measures
   */
  static initialize(): void {
    // Set up CSP violation reporting
    if (typeof window !== 'undefined') {
      window.addEventListener('securitypolicyviolation', this.handleCSPViolation);
      
      // Clear any expired storage items on init
      try {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('goldira_'));
        keys.forEach(key => {
          const value = this.secureStorage.get(key.replace('goldira_', ''));
          // get() method automatically removes expired items
        });
      } catch (error) {
        console.warn('Failed to clean expired storage:', error);
      }
    }
  }
}

// Analysis request rate limiter (5 requests per minute)
export const analysisRateLimiter = FrontendSecurity.createRateLimiter(5, 60 * 1000);

// General API rate limiter (100 requests per 15 minutes)  
export const apiRateLimiter = FrontendSecurity.createRateLimiter(100, 15 * 60 * 1000);

// Initialize security on module load
if (typeof window !== 'undefined') {
  FrontendSecurity.initialize();
}