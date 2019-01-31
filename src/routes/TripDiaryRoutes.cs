using System;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;
using System.Collections;
using System.Collections.Generic;
namespace TRAISI.SDK.Questions
{

	/// <summary>
	/// 
	/// </summary>
	[SurveyQuestion(QuestionResponseType.Json,
	CodeBundleName = "traisi-trip-diary-routes.module.js")]
	public class TripDiaryRoutes : ISurveyQuestion, INestedQuestionHost
	{

		/// <summary>
		/// 
		/// </summary>
		public string TypeName => "trip-diary-routes";


		/// <summary>
		/// 
		/// </summary>
		/// <value></value>
		public string Icon
		{
			get => "fas fa-route";
		}

		/// <summary>
		/// 
		/// </summary>
		/// <value></value>
		public QuestionIconType IconType { get => QuestionIconType.FONT; }


		/// <summary>
		/// 
		/// </summary>
		/// <value></value>
		[QuestionConfiguration(QuestionConfigurationValueType.KeyValuePair,
			Name = "Purpose",
			Description = "Purpose of being at location.",
			SurveyBuilderValueType = QuestionBuilderType.MultiSelect)]
		public Dictionary<string, string> Purposes = new Dictionary<string, string>();


		/// <summary>
		/// Configuration definition that mapes location choices to a colour string.
		/// </summary>
		/// <typeparam name="string"></typeparam>
		/// <typeparam name="string"></typeparam>
		/// <returns></returns>
		[QuestionConfiguration(QuestionConfigurationValueType.KeyValuePair,
			Name = "Locations",
			Description = "Locations and their colour keys.",
			SurveyBuilderValueType = QuestionBuilderType.MultiSelect)]
		public Dictionary<string, string> LocationColourMap = new Dictionary<string, string>();


		/// <summary>
		/// 
		/// </summary>
		/// <returns></returns>
		public List<NestedQuestionDefinition> ConfigureNestedQuestions()
		{
			return new List<NesteNestedQuestionDefinition>();
		}

	}
}