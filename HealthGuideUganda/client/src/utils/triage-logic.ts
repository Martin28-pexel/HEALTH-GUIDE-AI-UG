import { Message, TriageResult } from "@/types";

/**
 * Simplified triage logic to categorize symptoms
 * In a real-world application, this would be much more sophisticated,
 * potentially using NLP to process symptom descriptions
 */
export function performTriage(messages: Message[]): TriageResult {
  // Extract all user messages to analyze
  const userMessages = messages.filter(message => message.role === 'user');
  
  if (userMessages.length === 0) {
    return {
      level: 'nonUrgent',
      recommendation: 'Please provide more information about your symptoms.'
    };
  }
  
  // Join all user messages for analysis
  const combinedText = userMessages.map(m => m.content.toLowerCase()).join(' ');
  
  // Check for emergency keywords
  const emergencyKeywords = [
    'emergency', 'ambulance', 'severe', 'can\'t breathe', 'heart attack', 'stroke', 
    'unconscious', 'convulsion', 'seizure', 'bleeding', 'badly injured', 'suicide',
    'not breathing', 'chest pain', 'choking', 'accident', 'bleeding heavily',
    'embeggeza', 'ambulansi', 'ssisobola kusa', 'kuzirika', 'munnyo obutayingira', 
    'dharura', 'ambulensi', 'siwezi kupumua', 'mshtuko wa moyo', 'kiharusi'
  ];
  
  const urgentKeywords = [
    'high fever', 'intense pain', 'broken bone', 'fracture', 'infection',
    'dehydration', 'migraine', 'vomiting', 'diarrhea', 'moderate pain',
    'omusujja mungi', 'okuvuna', 'emiwogo', 'okusesema', 'ekidukudu',
    'homa kali', 'maumivu makali', 'mfupa uliovunjika', 'kuumwa sana', 'kutapika'
  ];

  // Check for chronic conditions with concerning symptoms
  const chronicConditions = [
    'diabetes', 'diabetic', 'heart disease', 'hypertension', 'high blood pressure',
    'asthma', 'epilepsy', 'kidney disease', 'liver disease', 'cancer',
    'sukari', 'pressure', 'kisukari', 'moyo', 'figo', 'ini', 'kifua kikuu'
  ];

  const concerningSymptoms = [
    'dizzy', 'dizziness', 'fainting', 'fainted', 'passed out', 'confused', 'confusion',
    'blurry vision', 'numbness', 'tingling', 'sweating', 'shaking', 'weak', 'weakness',
    'headache', 'severe headache', 'trouble speaking', 'slurred speech',
    'okulimbibwa', 'ebizindaro', 'obutategera bulungi', 'okuvaamu amaanyi',
    'kizunguzungu', 'kupoteza fahamu', 'kuanguka', 'kutokwa na jasho', 'kutetemeka'
  ];
  
  // Check for emergency conditions
  for (const keyword of emergencyKeywords) {
    if (combinedText.includes(keyword)) {
      return {
        level: 'emergency',
        recommendation: 'Based on your symptoms, you should seek emergency care immediately.'
      };
    }
  }

  // Check for chronic conditions with concerning symptoms (potentially serious)
  let hasChronicCondition = false;
  for (const condition of chronicConditions) {
    if (combinedText.includes(condition)) {
      hasChronicCondition = true;
      break;
    }
  }

  if (hasChronicCondition) {
    for (const symptom of concerningSymptoms) {
      if (combinedText.includes(symptom)) {
        return {
          level: 'urgent',
          recommendation: 'With your condition, these symptoms require medical attention. Please see a healthcare provider within 24 hours.'
        };
      }
    }
  }
  
  // Check for urgent conditions
  for (const keyword of urgentKeywords) {
    if (combinedText.includes(keyword)) {
      return {
        level: 'urgent',
        recommendation: 'Your symptoms suggest you should see a healthcare provider within 24 hours.'
      };
    }
  }
  
  // If the person has a chronic condition, even without concerning symptoms, suggest monitoring
  if (hasChronicCondition) {
    return {
      level: 'nonUrgent',
      recommendation: 'Monitor your condition closely. If symptoms worsen or you develop dizziness, confusion, or other new symptoms, please seek medical care promptly.'
    };
  }
  
  // Default to non-urgent if no specific patterns are matched
  return {
    level: 'nonUrgent',
    recommendation: 'Your symptoms can likely be managed at home. Rest and monitor your condition.'
  };
}

/**
 * Simple keyword-based symptom categorization
 * This is a basic implementation; a real system would use more advanced NLP
 */
export function categorizeSymptom(text: string): string | null {
  const textLower = text.toLowerCase();
  
  const categoryKeywords: Record<string, string[]> = {
    fever: ['fever', 'temperature', 'hot', 'omusujja', 'ebugumu', 'homa', 'joto'],
    breathing: ['breath', 'breathing', 'shortness', 'asthma', 'okussa', 'kupumua'],
    pain: ['pain', 'hurts', 'ache', 'headache', 'obulumi', 'omutwe', 'ennyone', 'maumivu'],
    injury: ['injury', 'wound', 'cut', 'broken', 'fracture', 'ekiwundu', 'ebisago', 'jeraha'],
    child: ['child', 'baby', 'infant', 'omwana', 'mtoto'],
  };
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (textLower.includes(keyword)) {
        return category;
      }
    }
  }
  
  return 'other'; // Default to "other" if no specific category is matched
}

/**
 * Generate follow-up questions based on symptom category
 */
export function getFollowUpQuestion(category: string, language: string = 'en'): { question: string, options: string[] } {
  // This would be expanded in a real application with proper internationalization
  const followUpQuestions: Record<string, { [key: string]: { question: string, options: string[] } }> = {
    fever: {
      en: {
        question: 'How long have you had the fever?',
        options: ['Less than 24 hours', '1-3 days', 'More than 3 days']
      },
      lg: {
        question: 'Omaze bbanga ki n\'omusujja?',
        options: ['Okusinga essawa 24', 'Ennaku 1-3', 'Okusinga ennaku 3']
      },
      sw: {
        question: 'Umeugua homa kwa muda gani?',
        options: ['Chini ya saa 24', 'Siku 1-3', 'Zaidi ya siku 3']
      }
    },
    breathing: {
      en: {
        question: 'How severe is your breathing difficulty?',
        options: ['Mild - can speak in full sentences', 'Moderate - need to pause when speaking', 'Severe - can only say a few words at a time']
      },
      lg: {
        question: 'Obuzibu bwo mu kussa bukali butya?',
        options: ['Kitono - osobola okwogera mu mboozi enzijjuvu', 'Wakati - weetaaga okuwummulako nga oyogera', 'Nyo - osobola okwogera ebigambo bitono mu kiseera']
      },
      sw: {
        question: 'Ugumu wako wa kupumua ni mkali kiasi gani?',
        options: ['Kidogo - naweza kuongea sentensi kamili', 'Wastani - nahitaji kupumzika ninapoongea', 'Kali - naweza kusema maneno machache tu kwa wakati mmoja']
      }
    },
    // More categories would be defined here
  };
  
  return followUpQuestions[category]?.[language] || {
    question: 'Please describe your symptoms in more detail',
    options: []
  };
}
